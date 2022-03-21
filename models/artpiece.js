const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ImageSchema = new Schema({
    url: String,
    filename: String
})

ImageSchema.virtual('thumbnail').get(function () {
    return this.url.replace('/upload', '/upload/w_300');
})

const ArtpieceSchema = new Schema({
    title: {
        type: String,
        default: 'Untitled'
    },
    image: ImageSchema,
    description: {
        type: String,
        default: 'Edit this description...'
    },
    tags: {
        type: [String],
        default: []
    }
})

module.exports = mongoose.model('Artpiece', ArtpieceSchema);