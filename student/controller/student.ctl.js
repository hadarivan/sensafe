const mongoose = require('mongoose');
const Student = require('../models/student');

module.exports = {
    async getAllStudents(req, res) {    //admin get all studentd
        const result = await Student.find({})
        if(result.length===0) res.json("No Student was found")
        else if(result.length>0) res.json(result);
        else res.status(404).send('not found');
    },
    async deleteStudentById(req, res) {    //admin delete by id
        const {id=null} = req.body;
        const result = await Student.findOneAndDelete({id})
        console.log(result);
        if(result==null) res.json("No students were found") // checks if id exist if exist then delete
        else if(result) res.json(result);
        else res.status(404).send('not found');
    },
    async deleteStudentByClass(req, res) {    //delete by class
        const {grade=null} = req.body;
        const result = await Student.deleteMany({grade})
        console.log(result);
        if(result==null) res.json("No students were found") // checks if id exist if exist then delete
        else if(result) res.json(result);
        else res.status(404).send('not found');
    },
    async addStudent(req, res) { //add student
        const {
            id= null,
            name= null,
            grade= null,
            score= 0,
            level= "baby",
            achievements= [
                {_id:0, achievement:'הצטרף לאפליקציה',points:100, isDone:true},
                {_id:1, achievement:'עלה לרמה 2 בבוחן',points:200, isDone:false},
                {_id:2, achievement:'עלה לרמה 3 בבוחן',points:200, isDone:false},
                {_id:3, achievement:'קיבל 100 בבוחן',points:250, isDone:false},
                {_id:4, achievement:'עשה סימולציה בפעם הראשונה',points:250, isDone:false},
            ],
            profileColor= 'rgb(' + (Math.floor(Math.random() * 256)) + ',' + (Math.floor(Math.random() * 256)) + ',' + (Math.floor(Math.random() * 256)) + ')',
            quizLevel= 1,
            quizGrade= null,
            quizMistakes= [],
            failCount= 0,
            simApprove= null,
            simCount= 0,
        } = req.body;
        const result= await Student.find({id}); // checks if id already exist if not create a new student
        if(result.length===0){
            const student = new Student({id, name, grade, score, level, achievements, quizLevel, quizGrade, quizMistakes, failCount, profileColor, simApprove, simCount})
            console.log(student)
            student.save(function (err) {
                if (err) { 
                    handleError(res, err);
                }
                else {
                    res.json(student);
                }
            });
        }
        else if(result.length>0) res.json("Id already exists");
        else res.status(404).send('not found')
    },
    async editStudentById(req, res){  //edit student's name by id
        const {id=null, name=null} = req.body;
        const result =await Student.findOneAndUpdate({id},{$set:{name}},{});
        console.log(result);
        if(result==null) res.json("No student was found")  // checks if id exist if exist then edit
        else if(result) res.json(result);
        else res.status(404).send('not found');
    },
    async editStudentByName(req, res){  //edit student's id by name
        const {name=null, id=null} = req.body;
        const result =await Student.findOneAndUpdate({name},{$set:{id}},{});
        console.log(result);
        if(result==null) res.json("No student was found")  // checks if name exist if exist then edit
        else if(result) res.json(result);
        else res.status(404).send('not found');
    },
    async editStudentGrade(req, res){  //edit student's grade by id
        const {id=null, grade=null} = req.body;
        const result =await Student.findOneAndUpdate({id},{$set:{grade}},{});
        console.log(result);
        if(result==null) res.json("No student was found")  // checks if name exist if exist then edit
        else if(result) res.json(result);
        else res.status(404).send('not found');
    },
    async editStudentScore(req, res){  //edit student's score by id
        const {id=null, score=null} = req.body;
        const result =await Student.findOneAndUpdate({id},{$set:{score}},{});
        console.log(result);
        if(result==null) res.json("No student was found")  // checks if name exist if exist then edit
        else if(result) res.json(result);
        else res.status(404).send('not found');
    },
    async editStudentLevel(req, res){  //edit student's level by id
        const {id=null, level=null} = req.body;
        const result =await Student.findOneAndUpdate({id},{$set:{level}},{});
        console.log(result);
        if(result==null) res.json("No student was found")  // checks if name exist if exist then edit
        else if(result) res.json(result);
        else res.status(404).send('not found');
    },
    async editStudentAchievement(req, res){  //edit student's achievement by id
        const {id=null,_id=null, isDone=null} = req.body;
        const result =await Student.findOneAndUpdate({id, "achievements._id":_id},{$set: {"achievements.$.isDone": isDone}},{});
        console.log(result);
        if(result==null) res.json("No student was found")  // checks if name exist if exist then edit
        else if(result) res.json(result);
        else res.status(404).send('not found');
    },
    async editStudentQuizLevel(req, res){  //edit student's quizLevel by id
        const {id=null, quizLevel=null} = req.body;
        const result =await Student.findOneAndUpdate({id},{$set:{quizLevel}},{});
        console.log(result);
        if(result==null) res.json("No student was found")  // checks if name exist if exist then edit
        else if(result) res.json(result);
        else res.status(404).send('not found');
    },
    async editStudentQuizGrade(req, res){  //edit student's quizGrade by id
        const {id=null, quizGrade=null} = req.body;
        const result =await Student.findOneAndUpdate({id},{$set:{quizGrade}},{});
        console.log(result);
        if(result==null) res.json("No student was found")  // checks if name exist if exist then edit
        else if(result) res.json(result);
        else res.status(404).send('not found');
    },
    async addStudentQuizMistakes(req, res){  //edit student's quiz mistakes by id
        const {id=null, quizMistake=null} = req.body;
        const result =await Student.findOneAndUpdate({id},{$push: {quizMistakes: quizMistake}},{});
        console.log(result);
        if(result==null) res.json("No student was found")  // checks if name exist if exist then edit
        else if(result) res.json(result);
        else res.status(404).send('not found');
    },
    async editStudentFailCount(req, res){  //edit student's failCount by id
        const {id=null, failCount=null} = req.body;
        const result =await Student.findOneAndUpdate({id},{$set:{failCount}},{});
        console.log(result);
        if(result==null) res.json("No student was found")  // checks if name exist if exist then edit
        else if(result) res.json(result);
        else res.status(404).send('not found');
    },
    async editStudentSimCount(req, res){  //edit student's simCount by id
        const {id=null, simCount=null} = req.body;
        const result =await Student.findOneAndUpdate({id},{$set:{simCount}},{});
        console.log(result);
        if(result==null) res.json("No student was found")  // checks if name exist if exist then edit
        else if(result) res.json(result);
        else res.status(404).send('not found');
    },
    async editStudentSimApprove(req, res){  //edit student's simulation track mistakes by id
        const {id=null, simApprove=null} = req.body;
        const result =await Student.findOneAndUpdate({id},{$set:{simApprove}},{});
        console.log(result);
        if(result==null) res.json("No student was found")  // checks if name exist if exist then edit
        else if(result) res.json(result);
        else res.status(404).send('not found');
    },

    async getStudentById(req, res){  //show student by id
        const {id=null} = req.body; 
        const result =await Student.find({id})
        if(result.length===0) res.json("No student was found")
        else if(result.length>0) res.json(result);
        else res.status(404).send('not found');
    },
    async getStudentByName(req, res){  //show student by name
        const {name=null} = req.body; 
        const result =await Student.find({name})
        if(result.length===0) res.json("No student was found")
        else if(result.length>0) res.json(result);
        else res.status(404).send('not found');
    },

    async routeNotFound(req, res){  
        return res.json("Route not found, please try a different one");
    }
}
