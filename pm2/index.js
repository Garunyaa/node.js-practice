const mongoose = require('mongoose');
const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

require('dotenv').config();

const User = require('./user-model.js');
const ApiLog = require('./api-log-model.js');

const app = express();
const port = process.env.PORT || 5000;

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("DB Connected");
    } catch (error) {
        console.log("Failed to connect", error);
    }
}

connectDB();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const signup = async (req, res) => {
    try {
        const { name, email, password, phone_number } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({ name, email, phone_number, password: hashedPassword });
        res.status(200).json({ message: 'User signup successful', user });
    } catch (error) {
        console.error(error);
        res.status(400).json({ error: error.message });
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            res.status(400).json({ message: 'Please add email or password' });
            return;
        }
        const user = await User.findOne({ email: email });
        if (!user) {
            res.status(404).json({ message: 'User not found' });
            return;
        }
        const authToken = jwt.sign({ name: user.name, email: user.email, id: user._id }, process.env.SECRET_KEY);
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (passwordMatch) {
            user.password = undefined;
            res.status(200).json({ message: 'Login Successful', user, auth_token: authToken });
        } else {
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

const getUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select("-password");
        if (user) {
            res.status(200).json({ message: 'User details retrieved successfully', user });
        } else {
            res.status(400).json({ message: 'User not found' }, {});
        }
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' }, { error: error.message });
    }
};

const listUsers = async (req, res) => {
    try {
        const users = await User.find().select("-password");
        if (users.length != 0) {
            res.status(200).json({ message: 'Users list retrieved successfully', users });
        } else {
            res.status(400).json({ message: 'No users found' }, {});
        }
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' }, { error: error.message });
    }
};

const updateUser = async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true }).select("-password");
        if (user) {
            res.status(200).json({ message: 'User details updated successfully', user });
        } else {
            res.status(400).json({ message: 'User not found' }, {});
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' }, { error: error.message });
    }
};

const deleteUser = async (req, res) => {
    try {
        const result = await User.findByIdAndDelete(req.params.id)
        if (result) {
            res.status(200).json({ message: 'User details deleted successfully', result });
        } else {
            res.status(400).json({ message: 'User not found' }, {});
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' }, { error: error.message });
    }
};

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token == null) {
        return res.status(401).json({ message: 'No token provided' });
    }

    jwt.verify(token, process.env.SECRET_KEY, (err, user) => {
        if (err) {
            console.error(err);
            return res.status(403).json({ message: 'Invalid token' });
        }
        req.user = user; // Add the decoded user information to the request object
        next();
    });
};

// Middleware to log API requests and responses
class ApiLogger {
    createLog(req, res, next) {
        try {
            const startTime = new Date(); // Record the start time

            res.on('finish', async () => {
                const endTime = new Date(); // Record the end time
                const processTime = endTime - startTime; // Calculate process time in milliseconds

                const headers = req.headers;

                // Extract user ID from the JWT token in the Authorization header
                const authToken = req.headers.authorization;
                let user_id = null;
                if (authToken) {
                    const token = authToken.split(' ')[1]; // Extract the token part (Bearer token)
                    const decodedToken = jwt.verify(token, process.env.SECRET_KEY);
                    user_id = decodedToken.id; // Assuming the user ID is stored in the JWT payload as 'id'
                }

                const logData = {
                    request_user_agent: headers['user-agent'],
                    request_host: headers['origin'] || headers.host,
                    method: req.method,
                    request_url: req.originalUrl,
                    type: res.statusCode !== 200 ? 2 : 1,
                    status_code: res.statusCode,
                    status_message: res.statusMessage,
                    content_length: `${res.get('Content-Length') || 0} bytes`,
                    requested_at: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
                    user_id: user_id,
                    remote_address: req.connection.remoteAddress,
                    request_ip: req.ip,
                    process_time: `${processTime} ms`,
                };

                // Log the request and response details
                console.log('API Log:', logData);

                // Store logs in the database
                await ApiLog.create(logData);
            });

            next();
        } catch (err) {
            console.error('Error creating logs:', err.message);
            next();
        }
    }
}

// Create an instance of the ApiLogger class
const apiLogger = new ApiLogger();
// Register the createLog method as middleware
app.use(apiLogger.createLog.bind(apiLogger));

app.post('/api/user/signup', signup);
app.post('/api/user/login', login);
app.get('/api/user/get/:id', authenticateToken, getUser);
app.get('/api/user/list', authenticateToken, listUsers);
app.patch('/api/user/update/:id', authenticateToken, updateUser);
app.delete('/api/user/delete/:id', authenticateToken, deleteUser);

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});