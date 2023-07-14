var express = require('express');
var router = express.Router();
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const salt = 12;

router.get('/signup', (req, res, next) => {
  res.render('auth/signup.hbs');
});

router.post('/signup', (req, res, next) => {
  const { username, password } = req.body;

  if (!username || !password) {
    res.render('auth/signup', {
      errorMessage: 'All fields are mandatory. Please provide your username, email, and password.'
    });
    return;
  }

  bcrypt
    .genSalt(salt)
    .then((salts) => {
      return bcrypt.hash(password, salts);
    })
    .then((hashedPass) => {
      return User.create({ username, password: hashedPass });
    })
    .then((createdUser) => {
      console.log('Created user:', createdUser);
      res.redirect('/');
    })
    .catch((error) => {
      console.log('Error line 35:', error);
      if (error.code === 11000) {
        console.log('Username must be unique. Username is already used.');
        res.status(500).render('auth/signup.hbs', { errorMessage: 'User already exists.' });
      } else {
        next(error);
      }
    });
});

router.get('/login', (req, res, next) => {
  res.render('auth/login.hbs');
});

router.post('/login', (req, res, next) => {
  console.log('SESSION =====> ', req.session);
  const { username, password } = req.body;

  if (username === '' || password === '') {
    res.render('auth/login.hbs', {
      errorMessage: 'Please enter both username and password to login.'
    });
    return;
  }

  User.findOne({ username })
    .then((user) => {
      if (!user) {
        console.log('User not registered.');
        res.render('auth/login.hbs', { errorMessage: 'User not found and/or incorrect password.' });
        return;
      } else {
        const passwordMatch = bcrypt.compareSync(password, user.password);
        if (passwordMatch) {
          req.session.user = user;
          console.log('Sessions after login:', req.session);
          res.redirect('/');
        } else {
          console.log('Incorrect password.');
          res.render('auth/login.hbs', { errorMessage: 'User not found and/or incorrect password.' });
        }
      }
    })
    .catch((error) => next(error));
});

module.exports = router;
