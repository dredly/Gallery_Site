const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ImageSchema = new Schema({
    url: String,
    filename: String
})

ImageSchema.virtual('thumbnail').get(function () {
    return this.url.replace('/upload', '/upload/w_200');
})

const ArtpieceSchema = new Schema({
    title: String,
    image: ImageSchema,
    description: String,
    tags: [String]
})

module.exports = mongoose.model('Artpiece', ArtpieceSchema);