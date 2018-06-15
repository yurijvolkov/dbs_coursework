import {Error} from 'mongoose';
import Streets from '../../model/street';

/* eslint-disable import/prefer-default-export */
export async function updateById(req, res) {
  try {
    const {params: {streetId}} = req;
    const {buildings, ...update} = req.body;

    if (Object.prototype.hasOwnProperty.call(update, '_id')) {
      res.status(400).send({
        responseCode: 400,
        errorType: 'RequestError',
        errors: [{
          reason: '_id is not modifiable'
        }]
      }); return;
    } else if (buildings) {
      res.status(400).send({
        responseCode: 400,
        errorType: 'RequestError',
        errors: [{
          reason: 'buildings is not modifiable on this end-point'
        }]
      }); return;
    }

    const result = await Streets.updateOne({_id: streetId}, update, {new: true}).exec();

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
    if (e instanceof Error.CastError) {
      console.log(e);
      res.status(400).send({
        responseCode: 400,
        errorType: 'RequestError',
        errors: [{
          reason: `${e.path} is ${typeof e.value}, but need ${e.kind}`
        }]
      });
    } else {
      const body = {responseCode: 500, errorType: 'unknown'};

      console.error(e);
      res.status(500).send(body);
    }
  }
}

