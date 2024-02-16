const mongoose = require('mongoose');
const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const winston = require('winston');
const pm2 = require('pm2');

require('dotenv').config();

const User = require('./user-model.js');
const ApiLog = require('./api-log-model.js');

const app = express();
const port = process.env.PORT || 5000;
const pm2Port = process.env.PM2_PORT || 3000;

const logger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
    ),
    transports: [
        new winston.transports.File({ filename: 'logs/user-list.log' }),
        new winston.transports.File({ filename: 'logs/user-list-error.log', level: 'error' })
    ],
});

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        logger.info("DB Connected");
    } catch (error) {
        logger.error("Failed to connect to DB", { error: error.message });
    }
}

connectDB();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Middleware to log API requests and responses

const apiLogger = (req, res, next) => {
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
        logger.info('API Log:', logData);

        // Store logs in the database
        await ApiLog.create(logData);
    });

    next();
};

const startPM2 = () => {
    pm2.list((err, list) => {
        if (err) {
            logger.error("Failed to list PM2 processes", { error: err.message });
            return;
        }

        const isServerRunning = list.some((process) => process.name === 'user-list' && process.pm2_env.status === 'online');

        if (!isServerRunning) {
            console.log("Starting PM2");
            pm2.connect((err) => {
                if (err) {
                    logger.error("Failed to connect to PM2", { error: err.message });
                    process.exit(1);
                }

                const options = {
                    name: 'user-list',
                    script: 'index.js',
                    output: './logs/user-list.log',
                    error: './logs/user-list-error.log',
                    env: {
                        PORT: pm2Port // Specify the port for PM2 process
                    }
                };

                pm2.start(options, (err) => {
                    if (err) {
                        logger.error("Failed to start PM2 process", { error: err.message });
                        process.exit(1);
                    }

                    logger.info('Application started successfully with PM2.');
                    pm2.disconnect();
                });
            });
        } else {
            logger.info('Server is already running in PM2.');
        }
    });
};

const signup = async (req, res) => {
    const startTime = new Date();
    try {
        const { name, email, password, phone_number } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({ name, email, phone_number, password: hashedPassword });
        const user_id = user._id;

        const logData = {
            request_user_agent: req.headers['user-agent'],
            request_host: req.headers['origin'] || req.headers.host,
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
            process_time: `${new Date() - startTime} ms`,
        };

        logger.info('API Log:', logData);
        await ApiLog.create(logData);

        res.status(200).json({ message: 'User signup successful', user });
    } catch (error) {
        logger.error("Error in user signup", { error: error.message });
        res.status(400).json({ error: error.message });
    }
};

const login = async (req, res) => {
    const startTime = new Date();
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

        const user_id = user._id;

        const logData = {
            request_user_agent: req.headers['user-agent'],
            request_host: req.headers['origin'] || req.headers.host,
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
            process_time: `${new Date() - startTime} ms`,
        };

        logger.info('API Log:', logData);
        await ApiLog.create(logData);

        if (passwordMatch) {
            user.password = undefined;
            res.status(200).json({ message: 'Login Successful', user, auth_token: authToken });
        } else {
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (error) {
        logger.error("Error in user login", { error: error.message });
        res.status(500).json({ message: 'Internal Server Error' });
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
        logger.error("Error in listing users", { error: error.message });
        res.status(500).json({ message: 'Internal Server Error' }, { error: error.message });
    }
};

const buyProduct = async (req, res) => {
    try {
        let product = true;
        if (product) {
            res.status(200).json({ message: 'Bought product successfully' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' }, { error: error.message });
    }
};

const sellProduct = async (req, res) => {
    try {
        let product = true;
        if (product) {
            res.status(200).json({ message: 'Sold product successfully' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' }, { error: error.message });
    }
};

const createProduct = async (req, res) => {
    try {
        let product = true;
        if (product) {
            res.status(200).json({ message: 'Product created successfully' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' }, { error: error.message });
    }
};

const getLogs = async (req, res) => {
    try {
        const result = await ApiLog.find({ user_id: req.params.id }).exec();
        if (result.length != 0) {
            res.status(200).json({ message: 'User logs retrieved successfully', result });
        } else {
            res.status(400).json({ message: 'No logs found' }, {});
        }
    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error' }, { error: error.message });
    }
};

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token == null) {
        return res.status(401).json({ message: 'No token provided' });
    }

    jwt.verify(token, process.env.SECRET_KEY, async (err, user) => {
        if (err) {
            logger.error("Error in token verification", { error: err.message });
            return res.status(403).json({ message: 'Invalid token' });
        }

        const existingUser = await User.findById(user.id);
        if (!existingUser) {
            return res.status(403).json({ message: 'User not found' });
        }

        req.user = user; // Add the decoded user information to the request object

        // Check if the token matches the user making the request
        if (req.params.id !== user.id) {
            return res.status(403).json({ message: 'Token does not match the user' });
        }
        next();
    });
};

// Middleware to log errors
app.use((err, req, res, next) => {
    logger.error('Internal server error:', { error: err.stack });
    res.status(500).json({ error: 'Internal Server Error' });
});

app.post('/api/user/signup', signup);
app.post('/api/user/login', login);
app.get('/api/user/list/:id', authenticateToken, apiLogger, listUsers);
app.post('/api/user/buy/:id', authenticateToken, apiLogger, buyProduct);
app.post('/api/user/sell/:id', authenticateToken, apiLogger, sellProduct);
app.post('/api/user/create/:id', authenticateToken, apiLogger, createProduct);
app.get('/api/logs/:id', apiLogger, getLogs);

app.listen(port, () => {
    logger.info(`Server running on port ${port}`);
    startPM2(); // Start PM2 only when the server is successfully listening on the port
});