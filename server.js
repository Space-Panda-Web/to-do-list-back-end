const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const TaskModel = require('./models/tasks')

const app = express()
app.use(cors())
app.use(express.json())

const mongoURI = ""

mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;

db.on('connected', () => {
  console.log('Connected to MongoDB Atlas')
})

db.on('error', (err) => {
  console.error('MongoDB connection error', err)
});

app.get('/get', async (req, res) => {
  try {
    const result = await TaskModel.find();
    res.json(result);
  } catch (err) {
    res.json(err);
  }
});

app.put('/update/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await TaskModel.findByIdAndUpdate(id, { done: true }, { new: true });
    res.json(result);
  } catch (err) {
    res.json(err);
  }
});

app.delete('/delete/:id', (req, res) => {
  const {id} = req.params;
  TaskModel.findByIdAndDelete({ _id: id })
  .then(result => res.json(result))
  .catch(err => res.json(err))
})

app.post('/add', async (req, res) => {
  const task = req.body.task;

  try {
    const result = await TaskModel.create({ task: task });
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Data not saved' });
  }
});

app.listen(3001, () => {
  console.log("Server is Running")
})
