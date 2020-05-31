const express = require('express');
const studentCtl = require('./controller/student.ctl');
const app = express();
const port = process.env.PORT || 3000;
const bodyParser=require('body-parser');

app.set('port',port);
app.use('/', express.static('./public')); // for API
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(bodyParser.urlencoded({extended:false}));

/* All routes of admin */
app.get('/admin', studentCtl.getAllStudents); // shows all student to the admin.
app.post('/admin/delete', studentCtl.deleteStudentById); //admin can delete student by its id 
app.post('/admin/addStudent', studentCtl.addStudent); //admin can add student
app.post('/admin/editID', studentCtl.editStudentById); //admin can edit student by its id 
app.post('/admin/editName', studentCtl.editStudentByName); //admin edit delete student by its name
app.post('/admin/getStudentId', studentCtl.getStudentById); //show student by ID
app.post('/admin/getStudentName', studentCtl.getStudentByName); //show student by Name
/*All routes to edit student profile*/
app.post('/editGrade', studentCtl.editStudentGrade); //edit student grade
app.post('/editScore', studentCtl.editStudentScore); //edit student score 
app.post('/editLevel', studentCtl.editStudentLevel); //edit student level
app.post('/editAchievement', studentCtl.editStudentAchievement); //edit student level
app.post('/editQuizLevel', studentCtl.editStudentQuizLevel); //edit student quiz level
app.post('/editQuizGrade', studentCtl.editStudentQuizGrade); //edit student quiz grade
app.post('/addQuizMistakes', studentCtl.addStudentQuizMistakes); //edit student quiz mistakes
app.post('/editFailCount', studentCtl.editStudentFailCount); //count the number of times the student fail in the quiz on the same level
app.post('/editSimCount', studentCtl.editStudentSimCount); //count the number of times the student did simulation track
app.post('/addSimMistakes', studentCtl.addStudentSimMistakes); //edit student simulation track mistakes

app.all('*', studentCtl.routeNotFound);
app.listen(port, () => console.log(`listening on port ${port}`));
