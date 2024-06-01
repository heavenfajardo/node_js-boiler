// orders.controller.js
const express = require('express');
const router = express.Router();
const authorize = require('../_middleware/authorize');
const Role = require('../_helpers/role');
const orderService = require('./order.service');

// routes
router.post('/create', authorize(), createOrder);
router.get('/', authorize(Role.Admin), getAll);
router.get('/:id', authorize(), getById);
router.put('/:id', authorize(), update);
router.delete('/:id', authorize(), _delete);

module.exports = router;

async function createOrder(req, res, next) {
    try {
        const { items, totalPrice, paymentDetails } = req.body;

        // Extracting customer name and contact number from paymentDetails
        const { fullName, contactNumber } = paymentDetails;

        // Constructing order data
        const orderData = {
            product: JSON.stringify(items), // Assuming items is an array of products
            quantity: items.length, // Assuming quantity is the number of items
            totalPrice: totalPrice,
            status: 'Pending', // Assuming the initial status is 'Pending'
            accountId: req.user.id, // Assuming req.user.id contains the account id of the customer
            fullName: fullName, // Adding customer name to the order data
            contactNumber: contactNumber // Adding contact number to the order data
        };

        // Creating the order
        const order = await orderService.create(orderData);

        res.status(201).json(order);
    } catch (error) {
        console.error('Error creating order:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}


function getAll(req, res, next) {
    orderService.getAll()
        .then(orders => res.json(orders))
        .catch(next);
}

function getById(req, res, next) {
    orderService.getById(req.params.id, req.user.id)
        .then(order => order ? res.json(order) : res.sendStatus(404))
        .catch(next);
}

function update(req, res, next) {
    orderService.update(req.params.id, req.body, req.user.id)
        .then(order => res.json(order))
        .catch(next);
}

function _delete(req, res, next) {
    orderService.delete(req.params.id, req.user.id)
        .then(() => res.json({ message: 'Order deleted successfully' }))
        .catch(next);
}
