'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Role_Assigned extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.User, { foreignKey: 'user_id' });
      this.belongsTo(models.Role, { foreignKey: 'role_id' });
    }
  }
  Role_Assigned.init(
    {
      user_id: DataTypes.INTEGER,
      role_id: DataTypes.INTEGER,
      createdAt: DataTypes.DATE,
      updatedAt: DataTypes.DATE,
    },
    {
      sequelize,
      modelName: 'Role_Assigned',
      tableName: 'Role_Assigned',
      timestamps: true,
    },
  );
  return Role_Assigned;
};
