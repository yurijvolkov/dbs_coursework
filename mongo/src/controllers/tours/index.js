import {create, addCommentaries} from './create';
import {readAll, readById, readBy} from './read';
import {updateById} from './update';
import {deleteById, deleteCommentary} from './delete';

export default function init(app) {
  app.post('/tours', create);
  app.get('/tours', readAll);
  app.get('/tours/:tourId', readById);
  app.post('/tours/query', readBy);
  app.delete('/tours/:tourId', deleteById);
  app.put('/tours/:tourId', updateById);

  app.post('/tours/:tourId/commentaries', addCommentaries);
  app.delete('/tours/:tourId/commentaries/:commentaryId', deleteCommentary);
}

