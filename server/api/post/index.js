import {Router} from 'express';
import * as controller from './post.controller';
import * as auth from '../../auth/auth.service';

var router = new Router();

router.get('/', auth.isAuthenticated(), controller.getFeed);

router.get('/by/:name', controller.getByUser);
router.get('/by/:name/:slug', controller.getByUserAndSlug);

router.get('/search', controller.search);

router.put('/:id/like', auth.isAuthenticated(), controller.like);
router.put('/:id/unlike', auth.isAuthenticated(), controller.unlike);

router.get('/:id/responses', controller.getResponses);

router.get('/:id', controller.show);
router.post('/', auth.isAuthenticated(), controller.create);
router.put('/:id', auth.isAuthenticated(), controller.edit);
router.delete('/:id', auth.isAuthenticated(), controller.destroy);

export default router;
