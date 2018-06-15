import {Schema} from 'mongoose';
import rawLocationSchema from '../common/location';

/* eslint-disable import/prefer-default-export */
export const street = {
  name: {type: String, required: true},
  graphId: {type: String, required: true},
  wiki: String,
  location: rawLocationSchema,
  buildings: [{type: Schema.Types.ObjectId, ref: 'buildings'}]
};
