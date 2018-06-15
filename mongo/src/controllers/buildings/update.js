import {Error} from 'mongoose';
import Buildings from '../../model/building';

/* eslint-disable import/prefer-default-export */
export async function updateById(req, res) {
  try {
    const {params: {buildingId}} = req;
    const update = req.body;

    if (Object.prototype.hasOwnProperty.call(update, '_id')) {
      res.status(400).send({
        responseCode: 400,
        errorType: 'RequestError',
        errors: [{
          reason: '_id is not modifiable'
        }]
      }); return;
    } else if (Object.prototype.hasOwnProperty.call(update, 'streets')) {
      res.status(400).send({
        responseCode: 400,
        errorType: 'RequestError',
        errors: [{
          reason: 'streets are not modifiable at this end-point'
        }]
      }); return;
    } else if (Object.prototype.hasOwnProperty.call(update, 'rooms')) {
      res.status(400).send({
        responseCode: 400,
        errorType: 'RequestError',
        errors: [{
          reason: 'rooms are not modifiable at this end-point'
        }]
      }); return;
    } else if (Object.prototype.hasOwnProperty.call(update, 'plans')) {
      res.status(400).send({
        responseCode: 400,
        errorType: 'RequestError',
        errors: [{
          reason: 'plans are not modifiable at this end-point'
        }]
      }); return;
    }
    const result = await Buildings.updateOne({_id: buildingId}, update, {new: true}).exec();

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
