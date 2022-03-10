const dbService = require('../../services/db.service')
const logger = require('../../services/logger.service')
const { ObjectId } = require('mongodb');

async function query() {
    try {
        const collection = await dbService.getCollection('player')
        var players = await collection.find().toArray()
        return players
    } catch (err) {
        logger.error('cannot find players', err)
        throw err
    }
}
async function queryPending() {
    try {
        const collection = await dbService.getCollection('player')
        var players = await collection.find({ "status": { $eq: 'pending' } }).toArray()
        return players
    } catch (err) {
        logger.error('cannot find players', err)
        throw err
    }
}

async function getById(playerId) {
    try {
        const collection = await dbService.getCollection('player')
        const player = collection.findOne({ '_id': ObjectId(playerId) })
        return player
    } catch (err) {
        logger.error(`while finding player ${playerId}`, err)
        throw err
    }
}

async function remove(playerId) {
    try {
        const collection = await dbService.getCollection('player')
        await collection.deleteOne({ '_id': ObjectId(playerId) })
        return playerId
    } catch (err) {
        logger.error(`cannot remove player ${playerId}`, err)
        throw err
    }
}

async function add(player) {
    try {
        const collection = await dbService.getCollection('player')
        const addedPlayer = await collection.insertOne(player)
        // console.log(addedPlayer.ops[0]);
        return addedPlayer.ops[0]
    } catch (err) {
        logger.error('cannot insert player', err)
        throw err
    }
}
async function update(player) {
    try {
        var id = ObjectId(player._id)
        delete player._id
        const collection = await dbService.getCollection('player')
        await collection.updateOne({ "_id": id }, { $set: { ...player } })
        return player
    } catch (err) {
        logger.error(`cannot update player ${playerId}`, err)
        throw err
    }
}

module.exports = {
    remove,
    query,
    getById,
    add,
    update,
    queryPending,
}

