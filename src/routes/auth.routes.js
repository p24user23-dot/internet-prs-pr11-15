const express = require('express');
const AuthController = require('../controllers/auth.controller');
const validate = require('../middlewares/validate');
const { registerSchema } = require('../validations/auth.schema');

const router = express.Router();

router.post('/register', validate(registerSchema), AuthController.register);

// If the spec means POST /users 
router.post('/', validate(registerSchema), AuthController.register);

module.exports = router;
