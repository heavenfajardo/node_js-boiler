// order.service.js
const db = require('../_helpers/db');
const Order = db.Order;

module.exports = {
    create,
    getAll,
    getById,
    update,
    delete: _delete
};

async function create(orderData) {
    try {
        const order = await Order.create(orderData);
        return order;
    } catch (error) {
        throw error;
    }
}

async function getAll() {
    try {
        const orders = await Order.findAll();
        return orders.map(order => basicDetails(order));
    } catch (error) {
        throw error;
    }
}

async function getById(id, accountId) {
    try {
        const order = await getOrder(id);
        if (order.accountId !== accountId && !account.isAdmin) {
            throw 'Unauthorized';
        }
        return basicDetails(order);
    } catch (error) {
        throw error;
    }
}

async function update(id, params, accountId) {
    try {
        const order = await getOrder(id);
        if (order.accountId !== accountId && !account.isAdmin) {
            throw 'Unauthorized';
        }

        Object.assign(order, params);
        order.updated = Date.now();
        await order.save();

        return basicDetails(order);
    } catch (error) {
        throw error;
    }
}

async function _delete(id, accountId) {
    try {
        const order = await getOrder(id);
        if (order.accountId !== accountId && !account.isAdmin) {
            throw 'Unauthorized';
        }
        await order.destroy();
    } catch (error) {
        throw error;
    }
}

async function getOrder(id) {
    try {
        const order = await Order.findByPk(id);
        if (!order) throw 'Order not found';
        return order;
    } catch (error) {
        throw error;
    }
}

function basicDetails(order) {
    const { id, orderNumber, product, quantity, totalPrice, status, created, updated } = order;
    return { id, orderNumber, product, quantity, totalPrice, status, created, updated };
}
