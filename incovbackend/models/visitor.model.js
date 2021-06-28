const mongoose = require('mongoose');

const schema = mongoose.Schema;

const VisitorSchema = new schema({
    fullName : {
        type: String,
        required: true
    },
    NIC:{
        type: String,
        required: true
    },
    City:{
        type:String,
        required:true
    },
    Date:{
        type:Date,
        required:true
    },
    Manager_ID:{
        type:String,
        required:true
    },
    readings:{
        type:Array,
        required:true
    }

});

const Visitor= mongoose.model('Visitor',VisitorSchema);

module.exports = Visitor;
