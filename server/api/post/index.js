import {Router} from 'express';
import * as controller from './post.controller';
import * as auth from '../../auth/auth.service';

var router = new Router();

router.get('/', auth.isAuthenticated(), controller.getFeed);
router.get('/recent', controller.getNewest);

router.get('/by/:name', controller.getByUser);
router.get('/by/:name/:slug', controller.getByUserAndSlug);

//router.get('/tag', controller.getPopularTags);//
router.get('/tag/:tag', controller.findByTag);

router.get('/search', controller.textSearch);

router.get('/:id', controller.show);
router.post('/', auth.isAuthenticated(), controller.create);
router.put('/:id', auth.isAuthenticated(), controller.edit);
router.delete('/:id', auth.isAuthenticated(), controller.destroy);

export default router;
