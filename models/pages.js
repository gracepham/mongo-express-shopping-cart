const mongoose = require('mongoose');

const PageSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    slug: {
        type: String
        // Nguoi dung ko nhap slug --> slug tu title
        // title = home ==> slug = home
        // title = contact      us ==> slug = contact-us
    },
    content: {
        type: String,
        required: true
    }
})

const Page = mongoose.model('Page', PageSchema);
module.exports = {
    Page, PageSchema
}