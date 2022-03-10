const playerService = require('./player.service.js');
const logger = require('../../services/logger.service')

// GET LIST
async function getPlayers(req, res) {
    try {
        var queryParams = req.query;
        const players = await playerService.query(queryParams)
        res.json(players);
    } catch (err) {
        logger.error('Failed to get players', err)
        res.status(500).send({ err: 'Failed to get players' })
    }
}
//GET BY PENDING 
async function getPendingPlayers(req, res) {
    try {
        const players = await playerService.queryPending();
        res.json(players)
    } catch (err) {
        logger.error('Failed to get pending players', err)
    }
}

// GET BY ID 
async function getPlayerById(req, res) {
    try {
        const playerId = req.params.id;
        const player = await playerService.getById(playerId)
        res.json(player)
    } catch (err) {
        logger.error('Failed to get player', err)
        res.status(500).send({ err: 'Failed to get player' })
    }
}

// POST (add player)
async function addPlayer(req, res) {
    try {
        const player = req.body;
        const addedPlayer = await playerService.add(player)
        res.json(addedPlayer)
    } catch (err) {
        logger.error('Failed to add player', err)
        res.status(500).send({ err: 'Failed to add player' })
    }
}

// PUT (Update player)
async function updatePlayer(req, res) {
    try {
        const player = req.body;
        const updatedPlayer = await playerService.update(player)
        res.json(updatedPlayer)
    } catch (err) {
        logger.error('Failed to update player', err)
        res.status(500).send({ err: 'Failed to update player' })

    }
}

module.exports = {
    getPlayers,
    getPlayerById,
    addPlayer,
    updatePlayer,
    getPendingPlayers,
}
