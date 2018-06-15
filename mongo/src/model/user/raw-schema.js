/* eslint-disable import/prefer-default-export */
const historyEntry = {
  pathKey: {type: String, required: true},
  type: {type: String, required: true},
  date: {type: Date, required: true}
};

export const user = {
  username: {type: String, required: true},
  password: {type: String, required: true},
  routesHistory: [historyEntry]
};
