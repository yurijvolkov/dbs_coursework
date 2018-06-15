import {Error} from 'mongoose';
import Tours from '../../model/tour';

/* eslint-disable import/prefer-default-export */
export async function deleteById(req, res) {
  try {
    const {params: {tourId}} = req;
    const result = await Tours.deleteOne({_id: tourId}).exec();

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

export async function deleteCommentary(req, res) {
  try {
    const {params: {tourId, commentaryId}} = req;
    const result = await Tours.findByIdAndUpdate(tourId, {
      $pull: {commentaries: {_id: commentaryId}}
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
