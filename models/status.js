/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  let status = sequelize.define('status', {
     id: {
       type: DataTypes.INTEGER(10).UNSIGNED,
       allowNull: false,
       primaryKey: true
     },
     reg_date: {
       type: DataTypes.DATEONLY,
       allowNull: false
     },
     status_date: {
       type: DataTypes.DATEONLY,
       allowNull: false
     },
     status: {
       type: DataTypes.ENUM('PUBLISHED','ACTIVED','LOCKED','DELETED'),
       allowNull: false
     }
   }, {
     tableName: 'status'
   });
 
   //note 1 -> status 1
   status.associate=(models)=>{
     status.belongsTo(models.note, {foreignKey : "id"})
   }

   return status;
 };
 