const dbService = require('../../services/db.service')
const logger = require('../../services/logger.service')
const ObjectId = require('mongodb').ObjectId

async function query(filterBy) {
    console.log('filterBy', filterBy);
    if (filterBy.budget) {
        filterBy.budget = JSON.parse(filterBy.budget)
    }
    // console.log('filterBy-serviceback', filterBy);
    try {
        const criteria = _buildCriteria(filterBy)
        // const criteria = {};
        // console.log('filter', filterBy);
        // console.log('criteria', criteria);
        const collection = await dbService.getCollection('gig')
        // console.log('collection:', collection);
        var gigs = await collection.find(criteria).toArray()
        // console.log('gigs:', gigs);
        return gigs
    } catch (err) {
        logger.error('cannot find gigs', err)
        throw err
    }
}

async function getById(gigId) {
    try {
        const collection = await dbService.getCollection('gig')
        const gig = collection.findOne({ '_id': ObjectId(gigId) })
        return gig
    } catch (err) {
        logger.error(`while finding gig ${gigId}`, err)
        throw err
    }
}

async function remove(gigId) {
    try {
        const collection = await dbService.getCollection('gig')
        await collection.deleteOne({ '_id': ObjectId(gigId) })
        return gigId
    } catch (err) {
        logger.error(`cannot remove gig ${gigId}`, err)
        throw err
    }
}

async function add(gig) {
    try {
        const collection = await dbService.getCollection('gig')
        const addedGig = await collection.insertOne(gig)
        return addedGig
    } catch (err) {
        logger.error('cannot insert gig', err)
        throw err
    }
}
async function update(gig) {
    try {
        var id = ObjectId(gig._id)
        delete gig._id
        const collection = await dbService.getCollection('gig')
        await collection.updateOne({ "_id": id }, { $set: { ...gig } })
        return gig
    } catch (err) {
        logger.error(`cannot update gig ${gigId}`, err)
        throw err
    }
}
function _buildCriteria(filterBy) {
    // console.log('filterBy-criteria', filterBy);

    const criteria = {}
    if (filterBy.searchTerm && filterBy.searchTerm !== '') {
        const searchCriteria = { $regex: filterBy.searchTerm, $options: 'i' }
        criteria.title = searchCriteria;
    }

    if (filterBy.deliveryTime !== '') {
        if (filterBy.deliveryTime === 'Express 24H') criteria.daysToMake = { $lte: 1 };
        else if (filterBy.deliveryTime === 'Up to 3 days') criteria.daysToMake = { $lte: 3 };
        else if (filterBy.deliveryTime === 'Up to 7 days') criteria.daysToMake = { $lte: 7 };
    }

    if (filterBy.tag && filterBy.tag !== '') {
        console.log('im here');
        // const newTag = [filterBy.tag.toLowerCase()];
        const newTag = [filterBy.tag.toUpperCase()];
        criteria.tags = { $in: newTag };
    }
    
if (filterBy.budget) {

    if (filterBy.budget.min === null && typeof (filterBy.budget.max) === 'number') {
        criteria.price = { $lt: filterBy.budget.max }
        
    } else if (filterBy.budget.max === null && typeof (filterBy.budget.min) === 'number') {
        criteria.price = { $gt: filterBy.budget.min }

    } else if (typeof (filterBy.budget.min) === 'number' && typeof (filterBy.budget.max) === 'number') {
        criteria.price = { $gt: filterBy.budget.min, $lt: filterBy.budget.max }
    } else {
        criteria.price = { $gt : 0, $lt : 5000}
       }
   
}
    // { $range: [ <start>, <end>, <non-zero step> ] }

    return criteria
}




module.exports = {
    remove,
    query,
    getById,
    add,
    update,
}
