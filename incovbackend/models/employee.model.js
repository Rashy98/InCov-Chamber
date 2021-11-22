/*
    Employee model
*/


const mongoose = require('mongoose');
const schema = mongoose.Schema;

const EmployeeSchema = new schema({
    empID : {
        type: String,
        required: true
    },
    username:{
        type:String,
        required:true,
    },
    password:{
        type:String,
        required: true
    },
    fullName : {
        type: String,
        required: true
    },
    organization:{
        type: String,
        required: true
    },
    position:{
        type:String,
        required:true
    },
    dailyReadings:{
        type:Array,
        required:true
    },
    photo:{
        type:String,
        required: true
    }
});

const Employee= mongoose.model('Employee',EmployeeSchema);

module.exports = Employee;
