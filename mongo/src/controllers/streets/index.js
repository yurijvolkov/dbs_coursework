import {create} from './create';
import {readAll, readById, readBy} from './read';
import {updateById} from './update';
import {deleteById} from './delete';

export default function init(app) {
  app.post('/streets', create);
  app.get('/streets', readAll);
  app.get('/streets/:streetId', readById);
  app.post('/streets/query', readBy);
  app.delete('/streets/:streetId', deleteById);
  app.put('/streets/:streetId', updateById);
}

