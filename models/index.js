import mongoose from 'mongoose';
import accountsModel from './accountsModel.js';

const db = {};

db.url = process.env.MONGO_URL;
db.mongoose = mongoose;
db.account = accountsModel(mongoose);

export { db };
