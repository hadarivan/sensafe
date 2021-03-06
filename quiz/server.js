const express = require('express');
const adminCtl = require('./contoller/admin.ctl');
const studentCtl = require('./contoller/student.ctl');
const app = express();
const port = process.env.PORT || 3000;
const bodyParser=require('body-parser');


app.set('port',port);
app.use('/', express.static('./public')); // for API
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(bodyParser.urlencoded({extended:false}));
app.use(//middleware
(req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", 
    "Origin,X-Requested-With, Content-Type, Accept");
    res.set("Content-Type", "application/json");
    next();
});

/* All routes of student */
app.get('/student/level1', studentCtl.getLevel1Questions); // shows level 1 questions.
app.get('/student/level2', studentCtl.getLevel2Questions); // shows level 2 questions.
app.get('/student/level3', studentCtl.getLevel3Questions); // shows level 3 questions.
/* All routes of admin */
app.get('/admin/allQuestions', adminCtl.getAllQuestions);
app.post('/admin/deleteQuestion', adminCtl.deleteQuestion); //admin can delete question
app.post('/admin/addQuestion', adminCtl.addQuestion); //admin can add a question
app.post('/admin/editQuestion', adminCtl.editQuestion); //admin can edit a question
app.post('/admin/editLevel', adminCtl.editLevel); //admin can edit a question
app.post('/admin/editImage', adminCtl.editImage); //admin can edit a question
app.post('/admin/editAnswer', adminCtl.editAnswer); //admin can edit a question
app.post('/admin/editIsRight', adminCtl.editIsRight); //admin can edit a question
app.all('*', studentCtl.routeNotFound, adminCtl.routeNotFound);
app.listen(port, () => console.log(`listening on port ${port}`));