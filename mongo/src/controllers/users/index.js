import {create, addHistoryEntries} from './create';
import {readAll, readById, readBy} from './read';
import {updateById} from './update';
import {deleteById, deleteHistoryEntry} from './delete';

export default function init(app) {
  app.post('/users', create);
  app.get('/users', readAll);
  app.get('/users/:userId', readById);
  app.post('/users/query', readBy);
  app.delete('/users/:userId', deleteById);
  app.put('/users/:userId', updateById);

  app.post('/users/:userId/routesHistory', addHistoryEntries);
  app.delete('/users/:userId/routesHistory/:entryId', deleteHistoryEntry);
}

