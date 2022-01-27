const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ArtpieceSchema = new Schema({
    title: String,
    filename: String,
    description: String,
    tags: [String]
})

module.exports = mongoose.model('Artpiece', ArtpieceSchema);