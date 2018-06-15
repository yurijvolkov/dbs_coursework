import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import StreetsController from './controllers/streets';
import BuildingsController from './controllers/buildings';
import UsersController from './controllers/users';
import ToursController from './controllers/tours';

const app = express();

mongoose.connect('mongodb://mongo1:27017,mongo2:27017,mongo3:27017/dbs?replicaSet=sdb-cluster');
app.use(bodyParser.json());
app.listen(4000);

const db = mongoose.connection;

StreetsController(app);
BuildingsController(app);
UsersController(app);
ToursController(app);
db.on('error', console.error.bind(console, 'connection error:'));
