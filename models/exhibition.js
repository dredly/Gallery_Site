const mongoose = require('mongoose')
const Schema = mongoose.Schema

const ExhibitionSchema = new Schema({
    description: {
        type: String
    },
    startDate: {
        type: Date
    },
    endDate: {
        type: Date
    },
    exhibitionType: {
        type: String
    }
})

module.exports = mongoose.model('Exhibition', ExhibitionSchema)