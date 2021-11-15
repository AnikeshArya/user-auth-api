const User = require('../models/User');
const express = require("express");
const passport = require('passport');
const jwt = require('jsonwebtoken');
const config_default = require('../config/config');
const { validationResult } = require('express-validator');
const {
    generateHashedPassword,
    generateServerErrorCode,
    registerValidation,
    loginValidation,
  } = require('../config/utils');

const router = express.Router();

const createUser = (email, password,first_name, last_name) => {
    const data = {
      first_name,
      last_name,
      email,
      password: generateHashedPassword(password),
    };
    return new User(data).save();
  }

router.post('/register', registerValidation, async (req, res) => {
    const errorsAfterValidation = validationResult(req);
    if (!errorsAfterValidation.isEmpty()) {
      return res.status(400).json({
        code: 400,
        errors: errorsAfterValidation.mapped(),
      });
    } 
      try {
        const { email, password, first_name, last_name } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
          await createUser(email, password,first_name, last_name);
  
          // Sign token
          const newUser = await User.findOne({ email },{"first_name":1,"email":1,"roles":1,"status":1});
          const token = jwt.sign({ email }, config_default.passport.secret, {
            expiresIn: 10000000,
          });
          console.log(token)
          const userToReturn = { ...newUser.toJSON(), ...{ token } };  
          res.status(200).json(userToReturn);
        } else {
          generateServerErrorCode(res, 403, 'register email error', "USER_EXISTS_ALREADY", 'email');
        }
      } catch (e) {
        generateServerErrorCode(res, 500, e, "SOME_THING_WENT_WRONG");
      }
  });

  router.post('/login', loginValidation, async (req, res) => {
    const errorsAfterValidation = validationResult(req);
    if (!errorsAfterValidation.isEmpty()) {
      return res.status(400).json({
        code: 400,
        errors: errorsAfterValidation.mapped(),
      });
    } 
        const { email, password } = req.body;
        const user = await User.findOne({ email },{"first_name":1,"email":1,"password":1,"roles":1,"status":1});
        if (user && user.email) {
          const isPasswordMatched = user.comparePassword(password);
          if (isPasswordMatched) {
            // Sign token
            const token = jwt.sign({ email }, config_default.passport.secret,         
            {
              expiresIn: 1000000,
            });
            const userToReturn = { ...user.toJSON(), ...{ token } };
            delete userToReturn.password;
            res.status(200).json(userToReturn);
          } else {
            generateServerErrorCode(res, 403, 'login password error', "WRONG_PASSWORD", 'password');
          }
        } else {
          generateServerErrorCode(res, 404, 'login email error', "USER_DOES_NOT_EXIST", 'email');
        }
  });

router.get('/', passport.authenticate('jwt', { session: false }), async (req, res) => {
    try {
        const user= await User.find({},{"first_name":1,"email":1,"roles":1,"status":1}).skip(parseInt(req.query.offset)).limit(parseInt(req.query.limit));
        res.status(200).json(user);
    } catch(error) {
        res.status(404).json({message: error.message});
    }
});

router.get('/:id',passport.authenticate('jwt', { session: false }), async (req, res) =>{
    User.findById(req.params.id,{"first_name":1,"email":1,"roles":1,"status":1}, function (err, data) {
        if (err) return next(err);
        res.send(data);
    })
});


router.post('/', passport.authenticate('jwt', { session: false }),  async (req, res) =>{
    let user = new User(
        {
            first_name: req.body.first_name,
            last_name: req.body.last_name,
            email: req.body.email,
            password: req.body.password,
        }
    );

    user.save(function (err) {
        if (err) {
            return console.log(err);
        }
        res.send('User Created successfully')
    })
});


router.put('/:id',passport.authenticate('jwt', { session: false }), async (req, res)=> {
    User.findByIdAndUpdate(req.params.id, {$set: req.body}, function (err, data) {
        if (err) return next(err);
        res.send('User udpated.');
    });
});

router.delete('/:id', passport.authenticate('jwt', { session: false }), async  (req, res) => {
    User.findByIdAndRemove(req.params.id, function (err) {
        if (err) return next(err);
        res.send('Deleted successfully!');
    })
});
module.exports=router;
