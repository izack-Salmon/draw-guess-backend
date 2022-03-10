const dbService = require('../../services/db.service')
const logger = require('../../services/logger.service')
const { ObjectId } = require('mongodb');

async function query() {
    try {
        const collection = await dbService.getCollection('game')
        var games = await collection.find().toArray()
        return games
    } catch (err) {
        logger.error('cannot find games', err)
        throw err
    }
}

async function getById(gameId) {
    try {
        const collection = await dbService.getCollection('game')
        const game = collection.findOne({ '_id': ObjectId(gameId) })
        return game
    } catch (err) {
        logger.error(`while finding game ${gameId}`, err)
        throw err
    }
}

async function remove(gameId) {
    try {
        const collection = await dbService.getCollection('game')
        await collection.deleteOne({ '_id': ObjectId(gameId) })
        return gameId
    } catch (err) {
        logger.error(`cannot remove game ${gameId}`, err)
        throw err
    }
}

async function add(game) {
    try {
        const collection = await dbService.getCollection('game')
        const addedGame = await collection.insertOne(game)
        // console.log(addedGame.ops[0]);
        return addedGame.ops[0]
    } catch (err) {
        logger.error('cannot insert game', err)
        throw err
    }
}
async function update(game) {
    try {
        var id = ObjectId(game._id)
        delete game._id
        // console.log(game);
        const collection = await dbService.getCollection('game')
        await collection.updateOne({ "_id": id }, { $set: { ...game } })
        return game
    } catch (err) {
        logger.error(`cannot update game ${gameId}`, err)
        throw err
    }
}





module.exports = {
    remove,
    query,
    getById,
    add,
    update,
}
