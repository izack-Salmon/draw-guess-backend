const dbService = require('../../services/db.service')
const logger = require('../../services/logger.service')
const ObjectId = require('mongodb').ObjectId

async function query(filterBy) {
    console.log('filterBy-serviceback', filterBy);
    try {
        // const criteria = _buildCriteria(filterBy)
        const criteria = {};
        // console.log('filter', filterBy);
        // console.log('criteria', criteria);
        const collection = await dbService.getCollection('order')
        // console.log('collection:', collection);
        var orders = await collection.find(criteria).toArray()
        // console.log('orders:', orders);
        return orders
    } catch (err) {
        logger.error('cannot find orders', err)
        throw err
    }
}

async function getById(orderId) {
    try {
        const collection = await dbService.getCollection('order')
        const order = collection.findOne({ '_id': ObjectId(orderId) })
        return order
    } catch (err) {
        logger.error(`while finding order ${orderId}`, err)
        throw err
    }
}

async function remove(orderId) {
    try {
        const collection = await dbService.getCollection('order')
        await collection.deleteOne({ '_id': ObjectId(orderId) })
        return orderId
    } catch (err) {
        logger.error(`cannot remove order ${orderId}`, err)
        throw err
    }
}

async function add(order) {
    try {
        const collection = await dbService.getCollection('order')
        const addedOrder = await collection.insertOne(order)
        console.log('addedOrder.ops', addedOrder.ops);
        return addedOrder
    } catch (err) {
        logger.error('cannot insert order', err)
        throw err
    }
}
async function update(order) {
    try {
        var id = ObjectId(order._id)
        delete order._id
        const collection = await dbService.getCollection('order')
        await collection.updateOne({ "_id": id }, { $set: { ...order } })
        return order
    } catch (err) {
        logger.error(`cannot update order ${orderId}`, err)
        throw err
    }
}
function _buildCriteria(filterBy) {
    const criteria = {}
    if (filterBy.name) {
        const nameCriteria = { $regex: filterBy.name, $options: 'i' }
        criteria.name = nameCriteria
    }
    if (filterBy.inStock !== '' && filterBy.inStock !== 'all') {
        if (filterBy.inStock === 'inStock') criteria.inStock = { $eq: true }
        else if (filterBy.inStock === 'missing') criteria.inStock = { $eq: false }

        // criteria.inStock = { $eq: JSON.parse(filterBy.inStock) }
    }
    if (filterBy.labels && filterBy.labels.length) {
        criteria.labels = { $in: filterBy.labels }
    }
    // criteria.$or = [
    //     {
    //         name: nameCriteria
    //     },
    //     {
    //         inStock: txtCriteria
    //     }
    // ]
    return criteria
}




module.exports = {
    remove,
    query,
    getById,
    add,
    update,
}