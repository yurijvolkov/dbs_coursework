import mongoose from 'mongoose';
import {tour} from './raw-schema';

const schema = mongoose.Schema(tour);
const model  = mongoose.model('tours', schema); 

export default model;
