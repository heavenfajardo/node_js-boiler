// order.model.js
module.exports = (sequelize, DataTypes) => {
    const Order = sequelize.define('Order', {
        orderNumber: { type: DataTypes.STRING, allowNull: false },
        product: { type: DataTypes.STRING, allowNull: false },
        quantity: { type: DataTypes.INTEGER, allowNull: false },
        totalPrice: { type: DataTypes.FLOAT, allowNull: false },
        status: { type: DataTypes.STRING, allowNull: false, defaultValue: 'Pending' },
        accountId: { type: DataTypes.INTEGER, allowNull: false }
    });
    
    return Order;
};
