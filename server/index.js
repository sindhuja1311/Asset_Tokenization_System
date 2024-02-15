const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const session = require("express-session")
const userRoutes = require('./routes/userRoutes');
const propertyRoutes = require('./routes/propertyRoutes');

const app = express();
app.use(express.json());

app.use(session({
  secret: "your-secret-key", // Secret key for signing session ID cookie
  resave: false,
  saveUninitialized: false
}));
// Allow requests from the client's origin
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));

mongoose.connect('mongodb://localhost:27017/Asset_Tokenization');

app.use('/users', userRoutes);
app.use('/properties', propertyRoutes);

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
