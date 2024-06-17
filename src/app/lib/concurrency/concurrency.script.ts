export const concurrencyScript = `#!lua name=concurrency

local function process_queue(keys, args)
    local prefix = keys[1]
    local timestamp_key = prefix .. 'timestamp'
    local processing_key = prefix .. 'processing'
    local limit_key = prefix .. 'limit'
    local queue_key = prefix .. 'queue'
    local servers_prefix = prefix .. 'servers:'
    local channel_prefix = prefix .. 'channel:'

    local timestamp = tonumber(redis.call('GET', timestamp_key)) or 0
    local time = tonumber(redis.call('TIME')[1])

    -- cleaning up dead servers from processing list once per 3 seconds
    if timestamp + 3 <= time then
        local processing_requests = redis.call('SMEMBERS', processing_key)

        for _, request in ipairs(processing_requests) do
            local server = string.sub(request, 1, string.find(request, ':') - 1)
            local server_key = servers_prefix .. server

            if redis.call('EXISTS', server_key) == 0 then
                redis.call('SREM', processing_key, request)
            end
        end

        redis.call('SET', timestamp_key, time)
    end

    local limit = tonumber(redis.call('GET', limit_key)) or 10
    local processing_count = tonumber(redis.call('SCARD', processing_key)) or 0

    while processing_count < limit do
        local request = redis.call('LPOP', queue_key)
        if not request then break end

        local server = string.sub(request, 1, string.find(request, ':') - 1)
        local channel = channel_prefix .. server

        redis.call('SADD', processing_key, request)
        redis.call('PUBLISH', channel, request)
        processing_count = processing_count + 1
    end
end

local function add_request(keys, args)
    local prefix = keys[1]
    local request = args[1]
    local processing_key = prefix .. 'processing'
    local limit_key = prefix .. 'limit'
    local queue_key = prefix .. 'queue'

    local processing_count = tonumber(redis.call('SCARD', processing_key)) or 0
    local limit = tonumber(redis.call('GET', limit_key)) or 10

    if processing_count < limit then
        redis.call('SADD', processing_key, request)
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
    local processing_key = prefix .. 'processing'
    local queue_key = prefix .. 'queue'

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