const db = require('../mongodb');
let blogSchema = db.Schema({
    type: Array,
    title: String,
    desc: String,
    html: String,
    markdown: String,
    level: Number,
    github: String,
    source: Number,
    isVisible: Boolean,
    releaseTime: Date,
    createTime: { type: Date, default: Date.now}
})
module.exports = db.model('blog', blogSchema)