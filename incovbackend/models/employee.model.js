const mongoose = require('mongoose');

const schema = mongoose.Schema;

const EmployeeSchema = new schema({

    empID : {
        type: String,
        required: true
    },
    fullName : {
        type: String,
        required: true
    },
    dailyReadings:{
        type:Array
    }
});

const Employee= mongoose.model('Employee',EmployeeSchema);

module.exports = Employee;
