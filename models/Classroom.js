module.exports = (sequelize, Sequelize) => {
    const classroom = sequelize.define('classroom', {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            allowNull: false,
            primaryKey: true
        },
        name: {
            type: Sequelize.STRING,
            allowNull: false
        },
    });

    return classroom;
}