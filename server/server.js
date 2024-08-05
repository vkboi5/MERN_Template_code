const express = require('express'); // Importing express module
const mongoose = require('mongoose'); // Importing mongoose module
const dotenv = require('dotenv'); // Importing dotenv module
const cors = require('cors');


const app = express(); // Creating an instance of express
dotenv.config(); // Load environment variables from .env file
app.use(cors());

const PORT = process.env.PORT || 5000; // Defining the port number
const MONGODB_URI = process.env.MONGO_URI
// Middleware to parse JSON bodies
app.use(express.json());

// Connect to MongoDB
mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error);
  });


  const userSchema = new mongoose.Schema({
    name: String,
    email: String,
  });
  
  const User = mongoose.model('User', userSchema);
  
  // Add a route to create a new user
  app.post('/user', async (req, res) => {
    const { name, email } = req.body;
  
    try {
      const user = new User({ name, email });
      await user.save();
      res.status(201).send(user);
    } catch (error) {
      res.status(400).send(error);
    }
  });

  app.get('/usersdata', async (req, res) => {
    try {
      const users = await User.find();
      res.json(users);
    } catch (error) {
      res.status(500).send(error);
    }
  });

// Define a simple route
app.get('/', (req, res) => {
  res.send('Hi from the server');
});

// Starting the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
