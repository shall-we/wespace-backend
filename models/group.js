/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
    let group= sequelize.define('group_list', {
        user_id: {
            type: DataTypes.INTEGER(10).UNSIGNED,
            allowNull: false,
            primaryKey : true,
            references: {
                model: 'user',
                key: 'id'
            }
        },
        group_id: {
            type: DataTypes.INTEGER(10).UNSIGNED,
            primaryKey : true,
            unique : true,
            autoIncrement : true
        }
    }, {
        tableName: 'group_list',
        freezeTableName: true

    });

    return group;
};
