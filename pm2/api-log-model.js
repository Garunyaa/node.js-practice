const { Schema, model } = require('mongoose');

const ApiLogSchema = new Schema({
    request_user_agent: String,
    request_host: String,
    method: String,
    request_url: String,
    type: Number,
    status_message: String,
    content_length: String,
    requested_at: String,
    remote_address: String,
    request_ip: String,
    process_time: String,
    user_id: String,
    status: {
        type: Number,
        default: 1
    },
    created_at: {
        type: Date,
        default: Date.now
    }
});

const ApiLog = model('api-log', ApiLogSchema);

module.exports = ApiLog;