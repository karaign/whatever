'use strict';

import {Router} from 'express';
import * as controller from './user.controller';
import * as auth from '../../auth/auth.service';

var router = new Router();

router.get('/me', auth.isAuthenticated(), controller.me);

router.get('/', auth.hasRole('admin'), controller.index);
router.get('/name/:name', controller.getByName);
router.get('/:id', controller.show);

router.get('/:id/followers', controller.getFollowers);
router.get('/:id/following', controller.getFollowing);
router.put('/:id/follow', auth.isAuthenticated(), controller.followUser);
router.put('/:id/unfollow', auth.isAuthenticated(), controller.unfollowUser);

router.put('/:id/password', auth.isAuthenticated(), controller.changePassword);
router.post('/', controller.create);
router.delete('/:id', auth.hasRole('admin'), controller.destroy);

export default router;
