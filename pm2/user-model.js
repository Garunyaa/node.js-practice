const { Schema, model } = require('mongoose');

const UserSchema = new Schema({

    name: {
        type: String,
        required: [true, 'name must not be empty'],
    },
    email: {
        type: String,
        required: [true, 'email must not be empty'],
        unique: true
    },
    password: {
        type: String,
        required: [true, 'password must not be empty'],
    },
    phone_number: {
        type: String,
        required: [true, 'phone_number must not be empty'],
        unique: true
    },
    status: {
        type: Number,
        default: 1
    },
    created_at: {
        type: Date,
        default: Date.now
    }
}, { versionKey: false });

const User = model('user', UserSchema);

module.exports = User;