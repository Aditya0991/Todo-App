const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const TodoModel = require('./models/Todo')

const app = express();
app.use(cors());
app.use(express.json());
mongoose.connect('mongodb://127.0.0.1:27017/test').then(console.log("DB Connected"))
.catch("Not Connected")

const port = 8000;
app.get('/',(req,res)=>{
    res.send("Home page")
})

app.get('/get',(req,res)=>{
    TodoModel.find().then(result => res.json(result)).catch(err => res.json(err));
})
app.post('/add',(req,res)=>{
    const task = req.body.task;
    // console.log(task)
    TodoModel.create({
        task : task
    }).then(result => res.json(result))
    .catch(err =>res.json(err))
})

app.put('/edit/:id',(req,res)=>{
    const {id} = req.params;
    TodoModel.findByIdAndUpdate({_id:id }, {done:true})
    .then(result => res.json(result))
    .catch(err => res.json(err))
    
})

app.delete("/delete/:id",(req,res)=>{
    const {id} = req.params;
    TodoModel.deleteOne({_id : id})
    .then(TodoModel.find().then(result => res.json(result)).catch(err => res.json(err)))
    .catch(err => console.log(err))
    
})

app.listen(port,()=>{
    console.log(`Server is listening at port ${port}`);
})