const router = require('express').Router();

// middleware
function requireLogin(req, res, next) {
  if (req.session.currentUser) {
    next();
  } else {
    res.redirect('/login');
  }
}

/* GET home page */
router.get('/', (req, res, next) => {
  const currentUser = req.session.currentUser;
  res.render('index', { currentUser });
});

router.get('/main', (req, res) => {
  res.render('navigation/main');
});
router.get('/private', requireLogin, (req, res) => {
  const currentUser = req.session.currentUser;
  res.render('navigation/private', { currentUser });
});

module.exports = router;
