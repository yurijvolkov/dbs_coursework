import {Error} from 'mongoose';
import Users from '../../model/user';

/* eslint-disable import/prefer-default-export */
export async function deleteById(req, res) {
  try {
    const {params: {userId}} = req;
    const result = await Users.deleteOne({_id: userId}).exec();

    if (result !== null && result.n !== 0) {
      res.status(200).send({ok: true});
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
    if (e instanceof Error.CastError) {
      res.status(400).send({
        responseCode: 400,
        errorType: 'RequestError',
        errors: [{
          reason: 'wrong id'
        }]
      });
    } else {
      const body = {responseCode: 500, errorType: 'unknown'};

      console.error(e);
      res.status(500).send(body);
    }
  }
}

export async function deleteHistoryEntry(req, res) {
  try {
    const {params: {userId, entryId}} = req;
    const result = await Users.findByIdAndUpdate(userId, {
      $pull: {routesHistory: {_id: entryId}}
    }).exec();

    if (result !== null) {
      res.status(200).send({ok: true});
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
    if (e instanceof Error.CastError) {
      res.status(400).send({
        responseCode: 400,
        errorType: 'RequestError',
        errors: [{
          reason: 'wrong id'
        }]
      });
    } else {
      const body = {responseCode: 500, errorType: 'unknown'};

      console.error(e);
      res.status(500).send(body);
    }
  }
}
