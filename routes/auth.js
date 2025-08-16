const express = require('express');
const router = express.Router();

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (email && password) {
      res.json({ 
        success: true, 
        token: 'demo-jwt-token',
        user: { 
          id: 1, 
          name: 'Demo User', 
          email: email,
          company: 'Demo Company'
        }
      });
    } else {
      res.status(400).json({ 
        success: false, 
        error: 'Email and password are required' 
      });
    }
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

router.post('/register', async (req, res) => {
  try {
    const { name, email, company, password } = req.body;
    
    if (!name || !email || !password) {
      return res.status(400).json({ 
        success: false, 
        error: 'Name, email, and password are required' 
      });
    }
    
    res.json({ 
      success: true, 
      message: 'User registered successfully',
      user: { 
        id: Date.now(), 
        name, 
        email, 
        company: company || ''
      }
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

module.exports = router;
