const { error, success } = require('../helper/baseResponse');
const DB = require('../models');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { userHasRole } = require('../helper/userHasRole');
const { ADMIN_ROLE_ID } = require('../helper/constants');

const UserModel = DB.User;
const RoleModel = DB.Role;
const RoleAssignedModel = DB.Role_Assigned;

const createUser = async (req, res) => {
  try {
    const { firstName, lastName, email, password, roles } = req.body;

    const doUserExists = await UserModel.findOne({
      where: {
        email: email,
      },
    });
    if (doUserExists) {
      return res.status(400).json(error('User already exists', 400));
    }

    const salt = await bcrypt.genSalt(10);
    const securedPassword = await bcrypt.hash(password, salt);

    const createdUser = await UserModel.create({
      firstName,
      lastName,
      email,
      password: securedPassword,
    });

    for (let role of roles) {
      const roleDetails = await RoleModel.findOne({
        where: {
          name: role,
        },
      });
      await RoleAssignedModel.create({
        user_id: createdUser.id,
        role_id: roleDetails.id,
      });
    }

    return res.status(201).json(success('User Created Successfully', createdUser, 201));
  } catch (err) {
    return res.status(500).json(error(err.message, 500));
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    let user = await UserModel.findOne({
      where: {
        email: email,
      },
    });
    if (!user) {
      return res.status(400).json(error('User not found', 400));
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(400).json(error('Bad Credentials', 400));
    }

    const payload = {
      user,
    };
    const jwt_token = jwt.sign(payload, process.env.JWT_KEY);

    user = {
      ...user.dataValues,
      jwt_token,
    };

    return res.status(200).json(success('User Logged Successfully', user, 200));
  } catch (err) {
    return res.status(500).json(error(err.message, 500));
  }
};

const getUserById = async (req, res) => {
  try {
    const userId = req.params.id;
    const isAdmin = await userHasRole(req.user.id, ADMIN_ROLE_ID);
    if (req.user.id != userId && !isAdmin) {
      return res.status(403).json(error('User not authorized', 403));
    }
    const user = await UserModel.findOne({
      where: {
        id: userId,
      },
      attributes: {
        exclude: ['password'],
      },
    });
    return res.status(200).json(success('OK', user, 200));
  } catch (err) {
    return res.status(500).json(error(err.message, 500));
  }
};

const getAllUsers = async (req, res) => {
  try {
    const isAdmin = await userHasRole(req.user.id, ADMIN_ROLE_ID);
    if (!isAdmin) {
      return res.status(401).json(error('User not authorized', 401));
    }
    const users = await UserModel.findAll({
      include: {
        model: RoleAssignedModel,
        attributes: ['role_id'],
        include: {
          model: RoleModel,
          attributes: ['name'],
        },
      },
      attributes: { exclude: ['password'] },
    });
    return res.status(200).json(success('OK', users, 200));
  } catch (err) {
    return res.status(500).json(error(err.message, 500));
  }
};

const updateUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const userDetails = req.body;
    const isAdmin = await userHasRole(req.user.id, ADMIN_ROLE_ID);
    console.log(isAdmin, userId, req.user.id);

    if (req.user.id != userId && !isAdmin) {
      return res.status(401).json(error('User not authorized', 401));
    }
    const updatedUser = await UserModel.update(userDetails, {
      where: {
        id: userId,
      },
    });
    if (userDetails.roles) {
      await RoleAssignedModel.delete({
        where: {
          user_id: userId,
        },
      });

      for (let role of userDetails.roles) {
        const roleDetails = await RoleModel.findOne({
          where: {
            name: role,
          },
        });

        await RoleAssignedModel.create({
          role_id: roleDetails.id,
          user_id: userId,
        });
      }
    }
    return res.status(200).json(success('OK', updatedUser, 200));
  } catch (err) {
    return res.status(500).json(error(err.message, 500));
  }
};

const deleteUser = async (req, res) => {
  try {
    const isAdmin = await userHasRole(req.user.id, ADMIN_ROLE_ID);
    if (!isAdmin) {
      return res.status(401).json(error('User not Authorized', 401));
    }

    const userId = req.params.id;
    if (req.user.id == userId) {
      return res.status(400).json(error('Admin cannot delete his/her account', 400));
    }
    const doUserExists = await UserModel.findByPk(userId);
    if (!doUserExists) {
      return res.status(404).json(error('User not found', 404));
    }

    const deletedUser = await UserModel.destroy({
      where: {
        id: userId,
      },
    });

    return res.status(200).json(success('Delete Successfully', deletedUser, 200));
  } catch (err) {
    return res.status(500).json(error(err.message, 500));
  }
};

module.exports = { createUser, login, getUserById, getAllUsers, updateUser, deleteUser };
