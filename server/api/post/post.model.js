import mongoose from 'mongoose';
var {ObjectId} = mongoose.Schema;
import makeSlug from 'slug';
import {uniq as removeDuplicates, isEmpty} from 'lodash';
import paginatePlugin from 'mongoose-paginate';
import autopopulatePlugin from 'mongoose-autopopulate';
import {postsPerPage} from '../../config/environment';

const slugOptions = {
  replacement: '-',
  lower: true
};

var PostSchema = new mongoose.Schema({
  responseTo: {
    type: ObjectId,
    ref: 'Post',
    default: null,
    autopopulate: {
      select: 'title slug author'
    }
  },
  title: {
    type: String,
    required: true
  },
  slug: {
    type: String,
    match: /^[a-z0-9\-\*]+$/i
  },
  cut: {
    type: String
  },
  tags: [{
    type: String,
    match: /^[a-z0-9\-\*]+$/i,
    maxlength: 50
  }],
  likedBy: [{
    type: ObjectId,
    ref: 'User'
  }],
  body: {
    type: String,
    required: true,
    index: 'text'
  },
  author: {
    type: ObjectId,
    ref: 'User',
    autopopulate: {
      select: 'name displayName'
    }
  },
  date: {
    type: Date,
    default: Date.now
  }
});

paginatePlugin.paginate.options = {
  select: '-body',
  sort: {date: 'descending'},
  limit: postsPerPage
};

PostSchema
  .plugin(paginatePlugin)
  .plugin(autopopulatePlugin);

PostSchema
  .set('toJSON', {
    virtuals: true
  });

PostSchema
  .virtual('rating')
  .get(function() {
    return this.likedBy && this.likedBy.length;
  });

PostSchema
  .post('validate', function(next) {

    if (isEmpty(this.slug)) {
      this.slug = makeSlug(this.title, slugOptions);
    }

    if (isEmpty(this.cut)) {
      this.cut = this.body.split('\n\n')
        .slice(0, 2)
        .join('\n\n');
    }

    if (this.cut.length > 1000) {
      this.cut = this.cut.slice(0, 1000) + ' *(...)*';
    }

    this.tags = removeDuplicates(this.tags);

    next();
  });

// Ensure that slug is unique among one user's posts
PostSchema
  .path('slug')
  .validate(function(value, respond) {
    this.constructor.findOne({author: this.author, slug: value}).exec()
      .then(post => respond(post && !post.equals(this) ? false : true));
  });

export default mongoose.model('Post', PostSchema);
