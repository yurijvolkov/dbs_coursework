import mongoose from 'mongoose';
import rawLocationSchema from '../common/location';

export const room = {
  name: {type: String, required: true},
  graphId: {type: String, required: true},
  roomPlanId: {type: String, required: true},
  floor: {type: Number, required: true}
};

export const plan = {
  mapPlanId: {type: String, required: true}
};

export const building = {
  address: {type: String, required: true},
  graphId: {type: String, required: true},
  location: rawLocationSchema,
  type: {type: String, required: true},
  name: String,
  generalInfo: String,
  wiki: String,
  streets: [mongoose.Schema.Types.ObjectId],
  rooms: [room],
  plans: [plan]
};

