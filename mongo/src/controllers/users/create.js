import map from 'lodash/map';
import {Error} from 'mongoose';
import User from '../../model/user';

/* eslint-disable import/prefer-default-export */
export async function create(req, res) {
  try {
    const user = new User(req.body);
    const result = await user.save();

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

export async function addHistoryEntries(req, res) {
  try {
    const {params: {userId}} = req;
    const {entries} = req.body;

    if (!Array.isArray(entries)) {
      res.status(400).send({
        responseCode: 400,
        errorType: 'RequestError',
        errors: [{
          reason: 'entries must be an array'
        }]
      });
    }

    const result = await User.findByIdAndUpdate(userId, {
      $push: {routesHistory: {$each: entries}}
    }, {new: true}).exec();

    if (result !== null) {
      res.status(200).send(result);
    } else {
      res.status(404).send({
        responseCode: 404,
        errorType: 'NotFoundError',
        errors: [{
          reason: 'unknown id'
        }]
      });
    }
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
