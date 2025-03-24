const mongoose = require('mongoose');

const banneduserSchema = new mongoose.Schema({
    userId : {
        type : String , 
        required : true
    }
});

module.exports = mongoose.model('BannedUser' , banneduserSchema);