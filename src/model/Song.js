const mongoose = require('mongoose')
const { getRandomNumber } = require('../helper/random')
const Schema = mongoose.Schema

const SongSchema = new Schema({
    title: {
        type: String,
        required: true,
        index: true,
    },
    album: {
        type: String,
    },
    artwork: {
        type: String,
        default: function () {
            const random = getRandomNumber(1, 4)
            return `../../assets/img/nord${random}.png`
        },
    },
    artist: String,
    env: String,
    url: String,
    lyric: String,
    views: Number,
})


module.exports = mongoose.model('Song', SongSchema)
