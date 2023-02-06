import express from 'express';
import http from 'http';
import mongoose from 'mongoose';
import { config } from '../config/config';
import Logging from '../library/Logging';
import authorRoutes from '../routes/Author';
import bodyParser from 'body-parser';
import bookRoute from '../routes/Books';

const router = express();

mongoose.set('strictQuery', false);
//connect to mongo
mongoose
    .connect(config.mongo.url, { retryWrites: true, w: 'majority' })
    .then(() => {
        Logging.info('connected to mongoDB.');
        StartServer();
    })
    .catch((error) => {
        Logging.error('unable to connect');
        Logging.error(error);
    });

/** Only start the server if Mongo connects     */

const StartServer = () => {
    router.use((req, res, next) => {
        Logging.info(`Incomming -> method:[${req.method}] - Url:[${req.url}]- IP: [${req.socket.remoteAddress}]`);

        res.on('finish', () => {
            //log the response
            Logging.info(`Incomming -> method: [${req.method}] - Url:[${req.url}] - IP:[${req.socket.remoteAddress}] - status: [${res.statusCode}]`);
        });
        next();
    });
    router.use(express.urlencoded({ extended: true }));
    router.use(express.json());

    //Rules of Api
    router.use((req, res, next) => {
        res.header('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-with, Content-Type, Accept, Authorization');

        if (req.method == 'OPTIONS') {
            res.header('Access -control-Allow-Methods', 'PUT,POST,PATCH,DELETE,GET');
            return res.status(200).json({});
        }
        next();
    });
    //routes
    router.use('/authors', authorRoutes);
    router.use('/books', bookRoute);
    //HealthCheck
    router.get('/ping', (req, res, next) => res.status(200).json({ message: 'pong' }));

    //Error handling
    router.use((req, res, next) => {
        const error = new Error('not found');
        Logging.error(error);

        return res.status(404).json({ message: error.message });
    });

    http.createServer(router).listen(config.server.port, () => Logging.info(`Server is running on port ${config.server.port}`));
};
