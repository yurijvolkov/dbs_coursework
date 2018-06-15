import {Error} from 'mongoose';
import Buildings from '../../model/building';
import Streets from '../../model/street';

/* eslint-disable import/prefer-default-export */
/* eslint-disable no-underscore-dangle */
export async function deleteById(req, res) {
  try {
    const {params: {buildingId}} = req;
    const result = await Buildings.findOneAndRemove({_id: buildingId}).exec();

    if (result !== null) {
      if (Array.isArray(result.streets)) {
        await Promise.all(
          result.streets.map(
            id => Streets.findByIdAndUpdate(id, {
              $pull: {
                buildings: result._id
              }
            }).exec()
          )
        );
      }

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

export async function deletePlan(req, res) {
  try {
    const {params: {buildingId, planId}} = req;
    const result = await Buildings.findByIdAndUpdate(buildingId, {
      $pull: {plans: {_id: planId}}
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

export async function deleteStreet(req, res) {
  try {
    const {params: {buildingId, streetId}} = req;
    const result = await Buildings.findByIdAndUpdate(buildingId, {
      $pull: {streets: streetId}
    }).exec();

    console.log(result);
    if (result !== null) {
      await Streets.findByIdAndUpdate(streetId, {
        $pull: {buildings: result._id}
      }).exec();
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
