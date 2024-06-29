export const concurrencyScript = `#!lua name=concurrency

local HOUR = 60 * 60

local function process_queue(keys, args)
    local prefix = keys[1]
    local server = args[2]
    local timestamp_key = prefix .. 'timestamp'
    local processing_key = prefix .. 'processing'
    local limit_key = prefix .. 'limit'
    local queue_key = prefix .. 'queue'
    local servers_prefix = prefix .. 'servers:'
    local channel_prefix = prefix .. 'channel:'

    if server then
        processing_key = processing_key .. ':' .. server
        queue_key = queue_key .. ':' .. server
    end

    local timestamp = tonumber(redis.call('GET', timestamp_key)) or 0
    local time = tonumber(redis.call('TIME')[1])

    -- cleaning up dead servers from processing list at most once per 3 seconds
    if timestamp + 3 <= time then
        if server then
            local server_key = servers_prefix .. server

            if redis.call('EXISTS', server_key) == 0 then
                redis.call('DEL', processing_key)
            end
        else
            local processing_requests = redis.call('SMEMBERS', processing_key)
            local alive_server = nil
            local expired_server = nil

            for _, request in ipairs(processing_requests) do
                local request_server = string.sub(request, 1, string.find(request, ':') - 1)

                if request_server == alive_server or (request_server ~= expired_server and redis.call('EXISTS', servers_prefix .. request_server) == 1) then
                    alive_server = request_server
                else
                    expired_server = request_server
                    redis.call('SREM', processing_key, request)
                end
            end
        end

        redis.call('SET', timestamp_key, time)

        -- clean up later if server dies
        redis.call('EXPIRE', processing_key, HOUR)
        redis.call('EXPIRE', queue_key, HOUR)
    end

    local limit = tonumber(redis.call('GET', limit_key)) or 10
    local processing_count = tonumber(redis.call('SCARD', processing_key)) or 0
    local channel = server and (channel_prefix .. server)
    local alive_server = nil
    local expired_server = nil

    while processing_count < limit do
        local request = redis.call('LPOP', queue_key)
        if not request then break end

        local request_server = server or string.sub(request, 1, string.find(request, ':') - 1)
        local request_channel = channel or channel_prefix .. request_server

        redis.call('PUBLISH', request_channel, request)

        if request_server == alive_server or (request_server ~= expired_server and redis.call('EXISTS', servers_prefix .. request_server) == 1) then
            alive_server = request_server
            redis.call('SADD', processing_key, request)
            processing_count = processing_count + 1
        else
            expired_server = request_server
        end
    end
end

local function add_request(keys, args)
    local prefix = keys[1]
    local request = args[1]
    local server = args[2]
    local processing_key = prefix .. 'processing'
    local limit_key = prefix .. 'limit'
    local queue_key = prefix .. 'queue'

    if server then
        processing_key = processing_key .. ':' .. server
        queue_key = queue_key .. ':' .. server
    end

    local processing_count = tonumber(redis.call('SCARD', processing_key)) or 0
    local limit = tonumber(redis.call('GET', limit_key)) or 10

    if processing_count < limit then
        redis.call('SADD', processing_key, request)
        redis.call('EXPIRE', processing_key, HOUR)
        return true -- process immediately
    else
        redis.call('RPUSH', queue_key, request)
        process_queue(keys, args)
        return false -- wait for the queue
    end
end

local function complete_request(keys, args)
    local prefix = keys[1]
    local request = args[1]
    local server = args[2]
    local processing_key = prefix .. 'processing'
    local queue_key = prefix .. 'queue'

    if server then
        processing_key = processing_key .. ':' .. server
        queue_key = queue_key .. ':' .. server
    end

    local removed = redis.call('SREM', processing_key, 1, request)

    if removed == 0 then
        redis.call('LREM', queue_key, 1, request)
    end

    process_queue(keys, args)
end

redis.register_function('process_queue', process_queue)
redis.register_function('add_request', add_request)
redis.register_function('complete_request', complete_request)

`;
