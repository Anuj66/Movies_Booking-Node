const DB = require('../models');

const RoleAssignedModel = DB.Role_Assigned;

const userHasRole = async (userId, roleId) => {
  const checkRole = await RoleAssignedModel.findOne({
    where: {
      user_id: userId,
      role_id: roleId,
    },
  });
  if (checkRole) return true;
  return false;
};

module.exports = {
  userHasRole,
};
