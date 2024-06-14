export const concurrencyScript = `#!lua name=concurrency

local function process_queue(keys, args)
    local prefix = keys[1]
    local processing_key = prefix .. 'processing_count'
    local limit_key = prefix .. 'limit'
    local queue_key = prefix .. 'queue'
    local servers_prefix = prefix .. 'servers:'
    local channel_prefix = prefix .. 'channel:'

    local processing_count = tonumber(redis.call('GET', processing_key)) or 0
    local limit = tonumber(redis.call('GET', limit_key)) or 10

    if processing_count < 0 then
        processing_count = 0
    end

    local request = redis.call('LPOP', queue_key)

    while request do
        local server = string.sub(request, 1, string.find(request, ':') - 1)
        local server_key = servers_prefix .. server

        -- Check if server is still alive
        if redis.call('EXISTS', server_key) == 1 then
            processing_count = processing_count + 1
            redis.call("PUBLISH", channel_prefix .. server, request)
        else
            redis.log(redis.LOG_WARNING, 'Server ' .. server .. ' is not available')
        end

        if processing_count >= limit then
            break
        end

        request = redis.call('LPOP', queue_key)
    end

    redis.call('SET', processing_key, processing_count)
end

local function add_request(keys, args)
    local prefix = keys[1]
    local request = args[1]
    local processing_key = prefix .. 'processing_count'
    local limit_key = prefix .. 'limit'
    local queue_key = prefix .. 'queue'

    local processing_count = tonumber(redis.call('GET', processing_key)) or 0
    local limit = tonumber(redis.call('GET', limit_key)) or 10

    if processing_count < limit then
        redis.call('INCR', processing_key)
        return true
    else
        redis.call('RPUSH', queue_key, request)
        return false
    end
end

local function complete_request(keys, args)
    local prefix = keys[1]
    local processing_key = prefix .. 'processing_count'

    redis.call('DECR', processing_key)

    process_queue(keys, args)
end

redis.register_function('process_queue', process_queue)
redis.register_function('add_request', add_request)
redis.register_function('complete_request', complete_request)

`;