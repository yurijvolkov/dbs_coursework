import {Schema} from 'mongoose';

export const commentary = {
  author: {type: Schema.Types.ObjectId, required: true, ref: 'users'}, // user id
  text: {type: String, required: true},
  date: {type: Date, required: true}
};

export const tour = {
  name: {type: String, required: true},
  pathKey: {type: String, required: true},
  createDate: {type: Date, required: true},
  description: String,
  commentaries: [commentary]
};
