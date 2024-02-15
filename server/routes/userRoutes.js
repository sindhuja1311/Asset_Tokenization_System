const express = require("express");
const usersModel = require('../models/users');
const router = express.Router();
const session = require("express-session");

// Session configuration
router.use(session({
  secret: 'your_secret_key',
  resave: false,
  saveUninitialized: true
}));

// Body parser middleware
router.use(express.json());
router.use(express.urlencoded({ extended: true }));

// Authentication middleware
const authenticate = (req, res, next) => {
  if (req.session.email) {
    next(); // User is authenticated, proceed to the next middleware
  } else {
    res.status(401).json({ success: false, message: "Unauthorized" });
  }
};

// User registration route
router.post('/register', (req, res) => {
  usersModel.create(req.body)
    .then(user => res.json(user))
    .catch(err => res.status(400).json(err));
});

// User login route
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await usersModel.findOne({ email });
    if (user) {
      if (user.password === password) {
        req.session.email = email; // Set session variable
        res.json({ success: true, message: "Login successful" });
      } else {
        res.status(401).json({ success: false, message: "Incorrect password" });
      }
    } else {
      res.status(404).json({ success: false, message: "User not found" });
    }
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

// PUT update user details route
router.put('/update/:id', async (req, res) => {
  try {
    const userId = req.params.id;
    const updatedDetails = req.body;

    // Find the user by ID and update the details
    const updatedUser = await usersModel.findByIdAndUpdate(userId, updatedDetails, { new: true });

    if (!updatedUser) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.status(200).json({ success: true, message: 'User details updated successfully', user: updatedUser });
  } catch (error) {
    console.error('Error updating user details:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// GET user details by email route
router.get("/details/:email", async (req, res) => {
  try {
    const { email } = req.params;
    const user = await usersModel.findOne({ email });
    if (user) {
      res.json({ success: true, user });
    } else {
      res.status(404).json({ success: false, message: "User not found" });
    }
  } catch (error) {
    console.error("Error fetching user details:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});


//logout
router.get("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error("Error destroying session:", err);
      res.status(500).json({ success: false, message: "Internal server error" });
    } else {
      res.clearCookie("connect.sid"); // Clear the session cookie
      res.json({ success: true, message: "Logout successful" });
    }
  });
});
module.exports = router;
