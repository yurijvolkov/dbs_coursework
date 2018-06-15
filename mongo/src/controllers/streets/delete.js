import {Error} from 'mongoose';
import Streets from '../../model/street';

/* eslint-disable import/prefer-default-export */
export async function deleteById(req, res) {
  try {
    const {params: {streetId}} = req;
    const result = await Streets.deleteOne({_id: streetId}).exec();

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
