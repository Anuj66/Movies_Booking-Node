const { body, param } = require('express-validator');
const DB = require('../models');

const RolesModel = DB.Role;
const UserModel = DB.User;

const createUser = [
  body('firstName')
    .notEmpty()
    .withMessage('Please enter fullName field')
    .isString()
    .withMessage('Please enter valid string'),
  body('lastName')
    .notEmpty()
    .withMessage('Please enter fullName field')
    .isString()
    .withMessage('Please enter valid string'),
  body('email')
    .notEmpty()
    .withMessage('Please enter email field')
    .isEmail()
    .withMessage('Please enter valid email')
    .custom((value) => {
      return UserModel.findOne({
        where: {
          email: value,
        },
      }).then((user) => {
        if (user) {
          return Promise.reject('User with this email already exists!');
        }
        return true;
      });
    }),
  body('password')
    .notEmpty()
    .withMessage('Please enter password field')
    .isString()
    .withMessage('Please enter valid password'),
  body('roles')
    .notEmpty()
    .withMessage('Please enter roles field')
    .isArray()
    .withMessage('Please enter valid roles')
    .custom((value, { req }) => {
      return RolesModel.findAll().then((existingRoles) => {
        for (let role of value) {
          let validRole = false;
          for (let existingRole of existingRoles) {
            if (existingRole.name === role) {
              validRole = true;
              break;
            }
          }
          if (!validRole) {
            return Promise.reject('Role:' + role + ', does not exists');
          }
        }
        return true;
      });
    }),
];

const login = [
  body('email')
    .notEmpty()
    .withMessage('Please enter email field')
    .isEmail()
    .withMessage('Please enter valid email')
    .custom((value) => {
      return UserModel.findOne({
        where: {
          email: value,
        },
      }).then((user) => {
        if (!user) {
          return Promise.reject('User with this email not found!');
        }
        return true;
      });
    }),
  body('password')
    .notEmpty()
    .withMessage('Please enter password field')
    .isString()
    .withMessage('Please enter valid string'),
];

const getUserById = [
  param('id')
    .notEmpty()
    .withMessage('Please provide a id param')
    .isNumeric()
    .withMessage('Please enter a valid id param value')
    .custom((value) => {
      return UserModel.findByPk(value).then((user) => {
        if (!user) {
          return Promise.reject('User not found!');
        }
        return true;
      });
    }),
];

const updateUser = [
  param('id')
    .notEmpty()
    .withMessage('Please provide a id param')
    .isNumeric()
    .withMessage('Please enter a valid id param value')
    .custom((value) => {
      return UserModel.findByPk(value).then((user) => {
        if (!user) {
          return Promise.reject('User not found!');
        }
        return true;
      });
    }),
  body('firstName').optional().isString().withMessage('Please enter valid string'),
  body('lastName').isString().withMessage('Please enter valid string'),
  body('email')
    .optional()
    .isEmail()
    .withMessage('Please enter valid email')
    .custom((value) => {
      return UserModel.findOne({
        where: {
          email: value,
        },
      }).then((user) => {
        if (user) {
          return Promise.reject('User with this email already exists!');
        }
        return true;
      });
    }),
  body('roles')
    .optional()
    .isArray()
    .withMessage('Please enter valid roles')
    .custom((value, { req }) => {
      return RolesModel.findAll().then((existingRoles) => {
        for (let role of value) {
          let validRole = false;
          for (let existingRole of existingRoles) {
            if (existingRole.name === role) {
              validRole = true;
              break;
            }
          }
          if (!validRole) {
            return Promise.reject('Role:' + role + ', does not exists');
          }
        }
        return true;
      });
    }),
];

const deleteUser = [
  param('id')
    .notEmpty()
    .withMessage('Please provide an user id')
    .isNumeric()
    .withMessage('Please provide a valid user id')
    .custom((value) => {
      return UserModel.findByPk(value).then((user) => {
        if (!user) {
          return Promise.reject('User not found!');
        }
        return true;
      });
    }),
];

module.exports = {
  createUser,
  login,
  getUserById,
  updateUser,
  deleteUser,
};
