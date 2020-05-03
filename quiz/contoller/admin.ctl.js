const Question = require('../models/questions');

module.exports = {
async getAllQuestions(req, res) {    //admin get all questions
    const result = await Question.find({})
    if(result.length===0) res.send("No question was found")
    else if(result.length>0) res.json(result);
    else res.status(404).send('not found');
},
async deleteQuestion(req, res) {    //delete question
    const {question=null} = req.body;
    const result = await Question.findOneAndDelete({question})
    console.log(result);
    if(result==null) res.send("No question was found") // checks if question exist if exist then delete
    else if(result) res.json(result);
    else res.status(404).send('not found');
},
async addQuestion(req, res) { //add question
    const {
        level=null,
        question=null,
        image=null,
        answers=null
    } = req.body;
    const result= await Question.find({question}); // checks if question already exist if not create a new question
    console.log(result.length);
    if(result.length===0){
    const q = new Question({level, question, image, answers})
    console.log(q)

    q.save(function (err) {
        if (err) { 
            handleError(res, err);
        }
        else {
            res.send(q);
        }
    });
    }
    else if (result.length===0) res.send("Please enter all params")
    else if(result.length>0) res.send("question already exists");
    else res.status(404).send('not found')
},
async editQuestion(req, res){  //edit question
    const {question=null, update=null} = req.body;
    const result =await Question.findOneAndUpdate({question},{$set:{question:update}},{});
    if(result==null || question==="") res.send("No question was found")  // checks if question exist if exist then edit question
    else if(result) res.json(result);
    else res.status(404).send('not found');
},
async editLevel(req, res){  //edit level of question
    const {question=null, level=null} = req.body;
    const result =await Question.findOneAndUpdate({question},{$set:{level:level}},{});
    if(result==null || question==="") res.send("No question was found")  // checks if question exist if exist then edit level
    else if(result) res.json(result);
    else res.status(404).send('not found');
},
async editImage(req, res){  //edit image
    const {question=null, image=null} = req.body;
    const result =await Question.findOneAndUpdate({question},{$set:{image:image}},{});
    if(result==null || question==="") res.send("No question was found")  // checks if question exist if exist then edit image
    else if(result) res.json(result);
    else res.status(404).send('not found');
},
async editAnswer(req, res){  //edit question
    const {question=null, answer=null,update=null} = req.body;
    const result =await Question.findOneAndUpdate({question, 'answers.answer':answer},{$set:{'answers.$.answer':update}});
    console.log(result);
    if(result==null || answer==="") res.send("No question was found")  // checks if question exist if exist then edit answer
    else if(result) res.json(result);
    else res.status(404).send('not found');
},
async editIsRight(req, res){  //edit question
    const {question=null, answer=null,update=null} = req.body;
    const result =await Question.findOneAndUpdate({question, 'answers.answer':answer},{$set:{'answers.$.isRight':update}});
    console.log(result);
    if(result==null || answer==="") res.send("No question was found")  // checks if question exist if exist then edit is right
    else if(result) res.json(result);
    else res.status(404).send('not found');
},
async routeNotFound(req, res){  
    return res.send("Route not found, please try a different one");
}
}