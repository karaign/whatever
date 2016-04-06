import mongoose from 'mongoose';
import makeSlug from 'slug';
import {uniq as removeDuplicates, isEmpty} from 'lodash';
import paginatePlugin from 'mongoose-paginate';
import {postsPerPage} from '../../config/environment';

const slugOptions = {
  replacement: '-',
  lower: true
};

var PostSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    index: 'text'
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
    maxlength: 50
  }],
  comments: [String],
  body: {
    type: String,
    required: true,
    index: 'text'
  },
  author: {
    type: mongoose.Schema.ObjectId,
    ref: 'User'
  },
  date: {
    type: Date,
    default: Date.now
  }
});

paginatePlugin.paginate.options = {
  select: '-body -comments',
  sort: {date: 'descending'},
  limit: postsPerPage
};

PostSchema.plugin(paginatePlugin);

// Don't serialize the actual author document,
// just the public profile
PostSchema.set('toJSON', {
  transform(doc, ret, options) {
    if (typeof ret.author === 'object') {
      ret.author = doc.author.profile;
    }
    return ret;
  }
});

PostSchema
  .pre('validate', function(next) {

    if (isEmpty(this.slug)) {
      this.slug = makeSlug(this.title, slugOptions);
    }

    if (isEmpty(this.cut)) {
      this.cut = this.body.split('\n\n')
        .slice(0, 2)
        .join('\n\n');
    }

    if (this.cut.length > 1000) {
      this.cut = this.cut.slice(0, 1000) + ' **(...)**';
    }

    this.tags = removeDuplicates(this.tags);

    next();
  });

// Ensure that slug is unique among one user's posts
PostSchema
  .path('slug')
  .validate(function(value, respond) {
    this.constructor.findOne({author: this.author, slug: value}).exec()
      .then(post => respond(post ? false : true));
  });

export default mongoose.model('Post', PostSchema);
