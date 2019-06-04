/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  let user= sequelize.define('user', {
    id: {
      type: DataTypes.INTEGER(10).UNSIGNED,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING(30),
      allowNull: false
    },
    email: {
      type: DataTypes.STRING(30),
      allowNull: false
    },
    password: {
      type: DataTypes.STRING(128),
      allowNull: false
    },
    profile: {
      type: DataTypes.STRING(300),
      allowNull: false
    }
  }, {
    tableName: 'user'
  });

  //user 1 : folder_list n
  user.associate=(models) =>{
    user.hasMany(models.folder_list, {foreignKey : 'user_id'});
  };

  return user;
};
