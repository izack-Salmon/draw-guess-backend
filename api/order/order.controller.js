const OrderService = require('./Order.service.js');
const logger = require('../../services/logger.service')

// GET LIST
async function getOrders(req, res) {
    try {
        var queryParams = req.query;
        // console.log('queryParams:', queryParams);    
        const Orders = await OrderService.query(queryParams)
        // console.log('Orders23456', Orders);
        res.json(Orders);
    } catch (err) {
        logger.error('Failed to get Orders', err)
        res.status(500).send({ err: 'Failed to get Orders' })
    }
}

// GET BY ID 
async function getOrderById(req, res) {
    try {
        const OrderId = req.params.id;
        const Order = await OrderService.getById(OrderId)
        res.json(Order)
    } catch (err) {
        logger.error('Failed to get Order', err)
        res.status(500).send({ err: 'Failed to get Order' })
    }
}

// POST (add Order)
async function addOrder(req, res) {
    try {
        var order = req.body;
        const user = req.session.user
        if (user._id) {
            order.buyer = {
                id: user._id,
                fullname: user.fullname,
                imgUrl: user.imgUrl,
            }
            // console.log('order', order);
            const addedOrder = await OrderService.add(order)
            // console.log(addedOrder);

            res.json(addedOrder)
        }
    } catch (err) {
        logger.error('Failed to add Order', err)
        res.status(500).send({ err: 'Failed to add Order' })
    }
}

// PUT (Update Order)
async function updateOrder(req, res) {
    try {
        const Order = req.body;
        const updatedOrder = await OrderService.update(Order)
        res.json(updatedOrder)
    } catch (err) {
        logger.error('Failed to update Order', err)
        res.status(500).send({ err: 'Failed to update Order' })

    }
}

// DELETE (Remove Order)
async function removeOrder(req, res) {
    try {
        const OrderId = req.params.id;
        const removedId = await OrderService.remove(OrderId)
        res.send(removedId)
    } catch (err) {
        logger.error('Failed to remove Order', err)
        res.status(500).send({ err: 'Failed to remove Order' })
    }
}

module.exports = {
    getOrders,
    getOrderById,
    addOrder,
    updateOrder,
    removeOrder
}
