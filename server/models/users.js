// models/users.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    uname:{
        type:String,
        required:true,
    } ,
    email : {
        type:String,
        required:true,
    },
    password:{
        type:String,
        required:true,
    },
    full_name:{
        type:String,
        default:null,
    },
    phone_num:{
        type: Number,
        default:null,
    },
    metamask_id:{
        type:String,
        default:null,
    },
    aadhar_number:{
        type:String,
        default:null,
    },
    pan_card:{
        type:String,
        default:null,
    },
    pronouns:{
        type:String,
        default:null,
    },
    
});

const usersModel = mongoose.model('users', userSchema);

module.exports = usersModel;
