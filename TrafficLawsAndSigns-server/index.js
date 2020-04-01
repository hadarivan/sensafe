// npm modules
const express   = require('express')
const morgan    = require('morgan')

//my additional modules
const controller    = require('./controller')
const asyncWrapper  = require('./async.wrapper')

//establish app()
const app   = express()
const port  = process.env.PORT || 3000

//middleware
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(morgan('dev'));


//routes for traffic laws
app.get('/traffic_law', asyncWrapper(controller.getAllTrafficLaws));
app.post('/traffic_law/add', asyncWrapper(controller.addNewLaw));
app.post('/traffic_law/edit',asyncWrapper(controller.editTrafficLawByLaw));
app.post('/traffic_law/delete', asyncWrapper(controller.deleteTrafficLaw));

//routes for traffic signs
app.get('/traffic_sign', asyncWrapper(controller.getAllTrafficSigns));
app.post('/traffic_sign/add',asyncWrapper(controller.addNewTrafficSign));
app.post('/traffic_sign/editId',asyncWrapper(controller.editTrafficSignById));
app.post('/traffic_sign/editName',asyncWrapper(controller.editTrafficSignByName));
app.post('/traffic_sign/editToDo',asyncWrapper(controller.editTrafficSignBytoDo));
app.post('/traffic_sign/editImage',asyncWrapper(controller.editTrafficSignByImage));
app.post('/traffic_sign/delete',asyncWrapper(controller.deleteTrafficSign));

app.all('*',(req,res)=>{
    res.send('not found');
})

//run the server
app.listen(port, 
    ()=>console.log('Express server ready for requests on: ' ,port))



