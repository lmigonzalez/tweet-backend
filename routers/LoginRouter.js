const router = require('express').Router();

const { createUser, login } = require('../controllers/LoginController');

router.post('/create-user', createUser);

router.post('/login', login);

module.exports = router;
