import map from 'lodash/map';
import {Error} from 'mongoose';
import Building from '../../model/building';
import Streets from '../../model/street';

/* eslint-disable import/prefer-default-export */
/* eslint-disable no-underscore-dangle */
export async function create(req, res) {
  try {
    const building = new Building(req.body);
    const result = await building.save();

    if (Array.isArray(building.streets)) {
      await Promise.all(
        building.streets.map(
          id => Streets.findByIdAndUpdate(id, {
            $push: {
              buildings: result._id
            }
          }).exec()
        )
      );
    }

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
      console.log(e.result.getRawResponse());
      res.status(500).send(body);
    }
  }
}

export async function addPlans(req, res) {
  try {
    const {params: {buildingId}} = req;
    const {plans} = req.body;

    if (!Array.isArray(plans)) {
      res.status(400).send({
        responseCode: 400,
        errorType: 'RequestError',
        errors: [{
          reason: 'plans must be an array'
        }]
      });
    }

    const result = await Building.findByIdAndUpdate(buildingId, {
      $push: {plans: {$each: plans}}
    }, {new: true}).exec();

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
      console.log(e.result.getRawResponse());
      res.status(500).send(body);
    }
  }
}

export async function addStreets(req, res) {
  try {
    const {params: {buildingId}} = req;
    const {streets} = req.body;

    if (!Array.isArray(streets)) {
      res.status(400).send({
        responseCode: 400,
        errorType: 'RequestError',
        errors: [{
          reason: 'streets must be an array'
        }]
      });
    }

    const result = await Building.findByIdAndUpdate(buildingId, {
      $push: {streets: {$each: streets}}
    }).exec();

    await Promise.all(
      streets.map(id => Streets.findByIdAndUpdate(id, {
        $push: {buildings: result._id}
      }).exec())
    );

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
      console.log(e.result.getRawResponse());
      res.status(500).send(body);
    }
  }
}

