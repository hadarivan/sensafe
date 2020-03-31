const mongoose = require('mongoose');

const schema = {
    id: {type:String},
    name: {type:String},
    grade: {type:String},
    score:{type:Number},
    level: {type:String},
    achievements: [{achievement:String, points:Number, isDone:Boolean}],
    quizLevel: {type:Number},
    quizGrade: {type:Number},
    quizMistakes:{type:Array},
    failCount:{type:Number},
    simMistakes: {type:Array},
};

const students_schema = new mongoose.Schema(schema, {versionKey: false});
const student = mongoose.model('Student', students_schema);

module.exports=student;