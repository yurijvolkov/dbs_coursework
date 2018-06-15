import {Error} from 'mongoose';
import Tours from '../../model/tour';

/* eslint-disable import/prefer-default-export */
export async function readAll(req, res) {
  try {
    const resultSet = await Tours.find({}).exec();

    res.status(200).send(resultSet);
  } catch (e) {
    const body = {responseCode: 500, errorType: 'unknown'};

    console.error(e);
    res.status(500).send(body);
  }
}

export async function readById(req, res) {
  try {
    const {params: {tourId}} = req;
    const result = await Tours
      .findById(tourId)
      .populate('commentaries.author', '_id username')
      .exec();

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

export async function readBy(req, res) {
  let query;

  /* eslint-disable prefer-destructuring */
  if (req.method === 'GET') {
    query = req.query;
  } else if (req.method === 'POST') {
    query = req.body;
  } else {
    res.status(405).send({
      responseCode: 405,
      errorType: 'RequestError',
      errors: [{
        reason: 'only get and post allowed'
      }]
    });
  }

  try {
    const resultSet = await Tours.find(query).exec();

    if (resultSet !== null && resultSet.length !== 0) {
      res.status(200).send(resultSet);
    } else {
      res.status(404).send({
        responseCode: 404,
        errorType: 'NotFoundError',
        errors: [{
          reason: 'query doesn\'t match'
        }]
      });
    }
  } catch (e) {
    if (e instanceof Error.CastError) {
      res.status(400).send({
        responseCode: 400,
        errorType: 'RequestError',
        errors: [{
          reason: 'wrong query field type'
        }]
      });
    } else {
      const body = {responseCode: 500, errorType: 'unknown'};

      console.error(e);
      res.status(500).send(body);
    }
  }
}
