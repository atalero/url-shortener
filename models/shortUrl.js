const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const urlSchema = new Schema({
  url: String,
  shortenedUrl: String
});

const ModelClass = mongoose.model('shortUrl', urlSchema);

module.exports = ModelClass; 