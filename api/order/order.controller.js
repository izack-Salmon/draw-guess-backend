const orderService = require('./order.service');
const socketService = require('../../services/socket.service')
const logger = require('../../services/logger.service')

// GET LIST
async function getOrders(req, res) {
    try {
        var queryParams = req.query;
        // console.log('queryParams:', queryParams);    
        const orders = await orderService.query(queryParams)
        // console.log('Orders23456', Orders);
        res.json(orders);
    } catch (err) {
        logger.error('Failed to get Orders', err)
        res.status(500).send({ err: 'Failed to get Orders' })
    }
}

// GET BY ID 
async function getOrderById(req, res) {
    try {
        const orderId = req.params.id;
        const order = await orderService.getById(orderId)
        res.json(order)
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
            console.log('order', order);
            // console.log('order in backkkkkkkkkk', order);
            const addedOrder = await orderService.add(order)
            socketService.emitToUser({ type: 'purchase', data: order, userId: order.seller._id })

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
        const order = req.body;
        const updatedOrder = await orderService.update(order)
        res.json(updatedOrder)
    } catch (err) {
        logger.error('Failed to update Order', err)
        res.status(500).send({ err: 'Failed to update Order' })

    }
}

// DELETE (Remove Order)
async function removeOrder(req, res) {
    try {
        const orderId = req.params.id;
        const removedId = await orderService.remove(orderId)
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
