const express = require('express');
const router = express.Router();

router.post('/', function (req, res, next) {
  passport.authenticate('local', function (err, user) {
    if (err) {
      return next(err);
    }
    // Redirect if it fails
    if (!user) {
      res.writeHead(401, {
        'Content-Type': 'application/json'
      });
      return res.end();
    }
    req.logIn(user, function (err) {
      if (err) {
        return next(err);
      }
      const temp = req.session.passport;
      return req.session.regenerate(() => {
        req.session.passport = temp;
        req.session.user = user.username;
        req.session.userId = user.id;
        res.send('true');
      });;
    });
  })(req, res, next);
});

module.exports = router;