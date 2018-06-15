import mongoose from 'mongoose';
import {user} from './raw-schema';

const schema = mongoose.Schema(user);
const model  = mongoose.model('users', schema); 

export default model;
