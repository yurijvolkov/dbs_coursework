import map from 'lodash/map';
import {Error} from 'mongoose';
import Street from '../../model/street';

/* eslint-disable import/prefer-default-export */
export async function create(req, res) {
  try {
    const street = new Street(req.body);
    const result = await street.save();

    res.status(200).send(result);
  } catch (e) {
    if (e instanceof Error.ValidationError) {
      const body = {responseCode: 400, errorType: e.name};
      const errors = map(e.errors, (val, key) => ({field: key, reason: val.kind}));

      body.errors = errors;
      res.status(404).send(body);
    } else {
      const body = {responseCode: 500, errorType: 'unknown'};

      console.error(e);
      res.status(500).send(body);
    }
  }
}
