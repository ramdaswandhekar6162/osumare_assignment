const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3000;

app.use(bodyParser.json());

// In-memory storage for tasks
let tasks = [
  { id: 1, title: 'Task 1', description: 'Description 1' },
  { id: 2, title: 'Task 2', description: 'Description 2' },
];

// Middleware for basic validation
const validateTask = (req, res, next) => {
  const { title, description } = req.body;
  if (!title || !description) {
    return res.status(400).json({ error: 'Title and description are required' });
  }
  next();
};

// API documentation
app.get('/', (req, res) => {
  res.send('Task API Documentation: https://your-api-docs-url');
});

// Retrieve all tasks
app.get('/tasks', (req, res) => {
  res.status(200).json(tasks);
});

// Retrieve a specific task by ID
app.get('/tasks/:id', (req, res) => {
  const taskId = parseInt(req.params.id);
  const task = tasks.find((t) => t.id === taskId);

  if (!task) {
    return res.status(404).json({ error: 'Task not found' });
  }

  res.status(200).json(task);
});

// Create a new task
app.post('/tasks', validateTask, (req, res) => {
  const newTask = {
    id: tasks.length + 1,
    title: req.body.title,
    description: req.body.description,
  };

  tasks.push(newTask);
  res.status(201).json(newTask);
});

// Update an existing task by ID
app.put('/tasks/:id', validateTask, (req, res) => {
  const taskId = parseInt(req.params.id);
  const taskIndex = tasks.findIndex((t) => t.id === taskId);

  if (taskIndex === -1) {
    return res.status(404).json({ error: 'Task not found' });
  }

  tasks[taskIndex] = {
    id: taskId,
    title: req.body.title,
    description: req.body.description,
  };

  res.status(200).json(tasks[taskIndex]);
});

// Delete a task by ID
app.delete('/tasks/:id', (req, res) => {
  const taskId = parseInt(req.params.id);
  tasks = tasks.filter((t) => t.id !== taskId);

  res.status(200).json({ message: 'Task deleted successfully' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal Server Error' });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
