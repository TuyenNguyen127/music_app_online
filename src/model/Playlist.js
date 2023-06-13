const mongoose = require('mongoose')
const { getRandomNumber } = require('../helper/random')
const Schema = mongoose.Schema

const PlaylistSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    user_id: mongoose.Types.ObjectId, // none: => user create
    thumbnail: {
        type: String,
        default: function () {
            const random = getRandomNumber(0, 1);
            const ar = ['https://firebasestorage.googleapis.com/v0/b/music-app-2e474.appspot.com/o/Images%2Fthumb_1.png?alt=media&token=61c112d5-5dc2-4655-affa-3ae924b4f599',
                        'https://firebasestorage.googleapis.com/v0/b/music-app-2e474.appspot.com/o/Images%2Fthumb_2.png?alt=media&token=27fc87a3-9c86-4d1c-8caf-adb1ec1122a4']
            return ar[random]
        },
    },
    list_of_songs: {
        type: [mongoose.Types.ObjectId],
        default: [],
        ref: 'Song',
    },
})

module.exports = mongoose.model('Playlist', PlaylistSchema)
