const mongoose =require('mongoose');
const sha256 = require('sha256');
const userSchema = mongoose.Schema({
    first_name: {
        type: String,
        required: true,
    },
    last_name: {
        type: String,
        required: true,   
    },
    email: {
        type: String,
        required: true,
        unique: true,    
    },
    password: {
        type: String,
        required: true,
        unique: true,    
    },
    status: {
        type: String,
        required: true,
        default: "Active"
    },
    deleted: {
        type: Boolean,
        required: true,
        default: false
    },
    registered_on: {
        type: Date,
        default: new Date(),
    },
    roles: {
        type: Array,
        required: true,    
    },
})
userSchema.methods.comparePassword = function comparePassword(password) {
    return this.password === sha256(password);
  };

var userData=mongoose.model('Users',userSchema);
module.exports= userData;