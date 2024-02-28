const express = require('express');
const morgan = require('morgan');
const path = require('path');
const winston = require('winston');
const fileRouter = require('./routes');
const PORT = 3000;

// Configure Winston logger
const logger = winston.createLogger({
    level: 'info',
    format: winston.format.json(),
    defaultMeta: { service: 'file-uploader' },
    transports: [
        new winston.transports.Console(),
        new winston.transports.File({ filename: 'error.log', level: 'error' }),
        new winston.transports.File({ filename: 'combined.log' }),
    ],
});

const app = express();

// Use Morgan for HTTP request logging
app.use(morgan('combined'));

// Serve uploaded files
app.use('/uploads', express.static('uploads'));

// Use routes defined in the routes folder
app.use('/', fileRouter);

// Catch 404 and forward to error handler
app.use((req, res, next) => {
    const err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// Error handler
app.use((err, req, res, next) => {
    logger.error({
        message: err.message,
        error: err,
    });

    res.status(err.status || 500);
    res.json({
        error: {
            message: err.message,
        },
    });
});

// Start the server
app.listen(PORT, () => {
    logger.info(`Server is running on http://localhost:${PORT}`);
});
