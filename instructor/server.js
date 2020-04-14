const express = require('express');
const instructorCtl = require('./controller/instructor.ctl')
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
app.post('/instructor/create', instructorCtl.createInstructor); // create new instructor
app.post('/instructor/editId', instructorCtl.editId); // edit id
app.post('/instructor/editImage', instructorCtl.editImage); // edit id
app.post('/instructor/editName', instructorCtl.editName); // edit name
app.post('/instructor/editClassName', instructorCtl.editClassName); // edit classes
app.post('/instructor/editAll', instructorCtl.editAll); // edit classes
app.post('/instructor/deleteClassName', instructorCtl.deleteClassName); // delete classes
app.post('/instructor/addClassName', instructorCtl.addClassName); // add classes
app.get('/instructor', instructorCtl.allData);
app.post('/oneInstructor', instructorCtl.OneInstructor);



// app.get('/student/level2', studentCtl.getLevel2Questions); // shows level 2 questions.
// app.get('/student/level3', studentCtl.getLevel3Questions); // shows level 3 questions.
/* All routes of admin */
// app.get('/admin/allQuestions', adminCtl.getAllQuestions);
// app.post('/admin/deleteQuestion', adminCtl.deleteQuestion); //admin can delete question
// app.post('/admin/addQuestion', adminCtl.addQuestion); //admin can add a question
// app.post('/admin/editQuestion', adminCtl.editQuestion); //admin can edit a question
// app.post('/admin/editLevel', adminCtl.editLevel); //admin can edit a question
// app.post('/admin/editImage', adminCtl.editImage); //admin can edit a question
// app.post('/admin/editAnswer', adminCtl.editAnswer); //admin can edit a question
// app.post('/admin/editIsRight', adminCtl.editIsRight); //admin can edit a question
// app.all('*', studentCtl.routeNotFound, adminCtl.routeNotFound);
app.listen(port, () => console.log(`listening on port ${port}`));