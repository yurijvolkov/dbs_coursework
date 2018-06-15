import mongoose from 'mongoose';
import {street} from './raw-schema';

const schema = mongoose.Schema(street);
const model  = mongoose.model('streets', schema); 

export default model;
