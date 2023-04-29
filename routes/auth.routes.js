const express = require('express');
const router = express.Router();
const User = require('../models/User.model');
const bcrypt = require('bcryptjs');

router.get('/signup', (req, res) => {
  res.render('auth/signup');
});

router.post('/signup', async (req, res) => {
  try {
    const { username, email, password } = req.body;

    //user input validation
    if (!username || !email || !password) {
      res.render('auth/signup', {
        errorMessage: 'Please fill in all the fields'
      });
      return;
    }

    const user = await User.findOne({ username });

    if (user !== null) {
      res.render('auth/signup', { errorMessage: 'User already in use' });
      return;
    }

    //password handling
    const saltRounds = 10;
    const salt = bcrypt.genSaltSync(saltRounds);
    const hashedPassword = bcrypt.hashSync(password, salt);
    console.log('in signup3');

    await User.create({
      username,
      email,
      password: hashedPassword
    });

    console.log('user created');
  } catch (e) {
    console.log(e);
  }

  res.redirect('/');
});

router.get('/login', (req, res) => {
  res.render('auth/login');
});

router.get('/login', (req, res) => {
  res.render('auth/login');
});

router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });

  try {
    if (!username || !password) {
      res.render('auth/login', { errorMessage: 'Invalid login' });
      return;
    }

    if (!user) {
      res.render('auth/login', { errorMessage: 'User does not exist' });
      return;
    }

    //check if password matches
    if (bcrypt.compareSync(password, user.password)) {
      req.session.currentUser = user;
      res.redirect('/');
    } else {
      res.render('auth/login', { errorMessage: 'Invalid login' });
      return;
    }
  } catch (err) {
    console.log(err);
  }
});

router.post('/logout', async (req, res) => {
  req.session.destroy();
  res.redirect('/');
});

module.exports = router;
