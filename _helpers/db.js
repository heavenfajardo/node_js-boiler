const config = require('../config.json'); // Adjusted path
const mysql = require('mysql2/promise');
const { Sequelize, DataTypes } = require('sequelize');

const db = {};

initialize();

async function initialize() {
    const { host, port, user, password, database } = config.database;
    const connection = await mysql.createConnection({ host, port, user, password });
    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${database}\`;`);

    const sequelize = new Sequelize(database, user, password, { dialect: 'mysql' });

    db.Account = require('../accounts/account.model')(sequelize, DataTypes);
    db.RefreshToken = require('../accounts/refresh-token.model')(sequelize, DataTypes);
    db.Order = require('../orders/order.model')(sequelize, DataTypes);

    db.Account.hasMany(db.RefreshToken, { onDelete: 'CASCADE' });
    db.RefreshToken.belongsTo(db.Account);

    db.Account.hasMany(db.Order, { onDelete: 'CASCADE' });
    db.Order.belongsTo(db.Account);

    await sequelize.sync();
}

module.exports = db;
