import {create, addPlans, addStreets} from './create';
import {readAll, readById, readBy} from './read';
import {updateById} from './update';
import {deleteById, deletePlan, deleteStreet} from './delete';

export default function init(app) {
  app.post('/buildings', create);
  app.get('/buildings', readAll);
  app.get('/buildings/:buildingId', readById);
  app.post('/buildings/query', readBy);
  app.delete('/buildings/:buildingId', deleteById);
  app.put('/buildings/:buildingId', updateById);

  app.post('/buildings/:buildingId/plans', addPlans);
  app.delete('/buildings/:buildingId/plans/:planId', deletePlan);

  app.post('/buildings/:buildingId/streets', addStreets);
  app.delete('/buildings/:buildingId/streets/:streetId', deleteStreet);
}

