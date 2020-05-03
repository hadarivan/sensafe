const mongoose = require('mongoose');

const schema = {
    level: {type:Number},
    question: {type:String},
    image:{type:String},
    answers:[{answer:String, isRight:Boolean}]
};

const questions_schema = new mongoose.Schema(schema, {versionKey: false});
const question = mongoose.model('question', questions_schema);

module.exports=question;