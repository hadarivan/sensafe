const mongoose = require('mongoose');

const schema = {
    id:{type:Number},
    name:{type:String},
    className:{type:Array},
    password: {type:String},
};

const instructor_schema = new mongoose.Schema(schema, {versionKey: false});
const instructor = mongoose.model('instructor', instructor_schema);

module.exports=instructor;