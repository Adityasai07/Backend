const mongoose = require('mongoose');
const emploteeSchema = new mongoose.Schema({
    id : {
        type : String , 
        required : true
    },
    name : {
        type : String,
        required:true
    } , 
    email : {
        type : String,
        required:true
    } , 
    phone : {
        type : String,
        default:false
    } , 
    city : {
        type : String,
    }
});

module.exports = mongoose.model('Employee' , emploteeSchema)