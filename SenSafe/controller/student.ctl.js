const mongoose = require('mongoose');
const Student = require('../models/student');

module.exports = {
    async getAllStudents(req, res) {    //admin get all studentd
        const result = await Student.find({})
        if(result.length===0) res.send("No Student was found")
        else if(result.length>0) res.json(result);
        else res.status(404).send('not found');
    },
    async deleteStudentById(req, res) {    //admin delete by id
        const {id=null} = req.body;
        const result = await Student.findOneAndDelete({id})
        console.log(result);
        if(result==null) res.send("No students were found") // checks if id exist if exist then delete
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
                {achievement:'ציית לחוק פעם ראשונה',points:null, isDone:false},
                {achievement:'עלה לרמה 2 בבוחן',points:null, isDone:false},
                {achievement:'עלה לרמה 3 בבוחן',points:null, isDone:false},
                {achievement:'עלה לשלב אביר',points:null, isDone:false},
                {achievement:'עלה לשלב מלך',points:null, isDone:false},
            ],
            quizLevel= 1,
            quizGrade= null,
            quizMistakes= [],
            failCount= null,
            simMistakes= [],
        } = req.body;
        const result= await Student.find({id}); // checks if id already exist if not create a new student
        if(result.length===0){
            const student = new Student({id, name, grade, score, level, achievements, quizLevel, quizGrade, quizMistakes, failCount, simMistakes})
            console.log(student)
            student.save(function (err) {
                if (err) { 
                    handleError(res, err);
                }
                else {
                    res.send(student);
                }
            });
        }
        else if(result.length>0) res.send("Id already exists");
        else res.status(404).send('not found')
    },
    async editStudentById(req, res){  //edit student's name by id
        const {id=null, name=null} = req.body;
        const result =await Student.findOneAndUpdate({id},{$set:{name}},{});
        console.log(result);
        if(result==null) res.send("No student was found")  // checks if id exist if exist then edit
        else if(result) res.json(result);
        else res.status(404).send('not found');
    },
    async editStudentByName(req, res){  //edit student's id by name
        const {name=null, id=null} = req.body;
        const result =await Student.findOneAndUpdate({name},{$set:{id}},{});
        console.log(result);
        if(result==null) res.send("No student was found")  // checks if name exist if exist then edit
        else if(result) res.json(result);
        else res.status(404).send('not found');
    },
    async editStudentGrade(req, res){  //edit student's grade by id
        const {id=null, grade=null} = req.body;
        const result =await Student.findOneAndUpdate({id},{$set:{grade}},{});
        console.log(result);
        if(result==null) res.send("No student was found")  // checks if name exist if exist then edit
        else if(result) res.json(result);
        else res.status(404).send('not found');
    },
    async editStudentScore(req, res){  //edit student's score by id
        const {id=null, score=null} = req.body;
        const result =await Student.findOneAndUpdate({id},{$set:{score}},{});
        console.log(result);
        if(result==null) res.send("No student was found")  // checks if name exist if exist then edit
        else if(result) res.json(result);
        else res.status(404).send('not found');
    },
    async editStudentLevel(req, res){  //edit student's level by id
        const {id=null, level=null} = req.body;
        const result =await Student.findOneAndUpdate({id},{$set:{level}},{});
        console.log(result);
        if(result==null) res.send("No student was found")  // checks if name exist if exist then edit
        else if(result) res.json(result);
        else res.status(404).send('not found');
    },
    async editStudentQuizLevel(req, res){  //edit student's quizLevel by id
        const {id=null, quizLevel=null} = req.body;
        const result =await Student.findOneAndUpdate({id},{$set:{quizLevel}},{});
        console.log(result);
        if(result==null) res.send("No student was found")  // checks if name exist if exist then edit
        else if(result) res.json(result);
        else res.status(404).send('not found');
    },
    async editStudentQuizGrade(req, res){  //edit student's quizGrade by id
        const {id=null, quizGrade=null} = req.body;
        const result =await Student.findOneAndUpdate({id},{$set:{quizGrade}},{});
        console.log(result);
        if(result==null) res.send("No student was found")  // checks if name exist if exist then edit
        else if(result) res.json(result);
        else res.status(404).send('not found');
    },
    async addStudentQuizMistakes(req, res){  //edit student's quiz mistakes by id
        const {id=null, quizMistake=null} = req.body;
        const result =await Student.findOneAndUpdate({id},{$push: {quizMistakes: quizMistake}},{});
        console.log(result);
        if(result==null) res.send("No student was found")  // checks if name exist if exist then edit
        else if(result) res.json(result);
        else res.status(404).send('not found');
    },
    async editStudentFailCount(req, res){  //edit student's failCount by id
        const {id=null, failCount=null} = req.body;
        const result =await Student.findOneAndUpdate({id},{$set:{failCount}},{});
        console.log(result);
        if(result==null) res.send("No student was found")  // checks if name exist if exist then edit
        else if(result) res.json(result);
        else res.status(404).send('not found');
    },
    async addStudentSimMistakes(req, res){  //edit student's simulation track mistakes by id
        const {id=null, simMistake=null} = req.body;
        const result =await Student.findOneAndUpdate({id},{$push: {simMistakes: simMistake}},{});
        console.log(result);
        if(result==null) res.send("No student was found")  // checks if name exist if exist then edit
        else if(result) res.json(result);
        else res.status(404).send('not found');
    },

    async getStudentById(req, res){  //show student by id
        const {id=null} = req.body; 
        const result =await Student.find({id})
        if(result.length===0) res.send("No student was found")
        else if(result.length>0) res.json(result);
        else res.status(404).send('not found');
    },
    async getStudentByName(req, res){  //show student by name
        const {name=null} = req.body; 
        const result =await Student.find({name})
        if(result.length===0) res.send("No student was found")
        else if(result.length>0) res.json(result);
        else res.status(404).send('not found');
    },

    async routeNotFound(req, res){  
        return res.send("Route not found, please try a different one");
    }
}