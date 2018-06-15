import mongoose from 'mongoose';
import {building} from './raw-schema';

const schema = mongoose.Schema(building);
const model  = mongoose.model('buildings', schema);

export default model;
