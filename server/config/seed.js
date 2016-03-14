/**
 * Populate DB with sample data on server start
 * to disable, edit config/environment/index.js, and set `seedDB: false`
 */

'use strict';
import User from '../api/user/user.model';
import Post from '../api/post/post.model';

import {lorem, name, internet, random} from 'faker';
import request from 'request-promise';
import Promise from 'bluebird';

/********************************************
 * Settings
 */

const users = 10;
const posts = 50;

const loremUrl = 'http://jaspervdj.be/lorem-markdownum/markdown.txt?no-headers=on&no-code=on';

const defaultUser = {
  provider: 'local',
  displayName: 'Test User',
  about: 'A test user.',
  name: 'testuser',
  email: 'test@example.com',
  password: 'test'
};

const defaultAdmin = {
  provider: 'local',
  role: 'admin',
  displayName: 'Admin',
  name: 'testadmin',
  email: 'admin@example.com',
  password: 'admin'
};

/********************************************
 * Creating sample data 
 */

// clearing the database
User.find({}).remove().exec()
  .then(() => Post.find({}).remove().exec())
  .then(() => User.create(defaultUser, defaultAdmin)) // creating default user and admin
  .then(() => User.create(randomizeUsers()) // creating some random users
  .then(users => randomizePosts(users)) // creating random posts
  .then(posts => Post.create(posts))
  .then(() => console.log('Sample data created successfully!'))
  .catch(err => console.log('Error while populating DB with sample data:\n', err)));

/********************************************
 * Helper functions
 */

function randomizeUsers() {
  var result = [];
  while (result.length < users) {
    let first = name.firstName(),
        last  = name.lastName();
    result.push({
      provider: 'local',
      password: 'test',
      name: internet.userName(first, last),
      displayName: name.findName(first, last),
      about: lorem.sentences(2),
      avatar: internet.avatar(),
      email: internet.email(first, last)
    });
  }
  return result;
}

function randomizePosts(users) {
  var promises = [];
  while (promises.length < posts) {
    promises.push(randomPost(random.arrayElement(users)._id));
  }
  return Promise.all(promises);
}

function randomPost(author) {
  return request(loremUrl)
    .then(res => ({
      author,
      title: lorem.sentence(),
      tags: lorem.words(5),
      body: res
    }));
}