const gameService = require('./game.service.js');
const logger = require('../../services/logger.service')

// GET LIST
async function getGames(req, res) {
    try {
        const games = await gameService.query()
        res.json(games);
    } catch (err) {
        logger.error('Failed to get games', err)
        res.status(500).send({ err: 'Failed to get games' })
    }
}

// GET BY ID 
async function getGameById(req, res) {
    try {
        const gameId = req.params.id;
        const game = await gameService.getById(gameId)
        res.json(game)
    } catch (err) {
        logger.error('Failed to get game', err)
        res.status(500).send({ err: 'Failed to get game' })
    }
}

// POST (add game)
async function addGame(req, res) {
    try {
        const game = req.body;
        // console.log(game, 'game');
        const addedGame = await gameService.add(game)
        res.json(addedGame)
    } catch (err) {
        logger.error('Failed to add game', err)
        res.status(500).send({ err: 'Failed to add game' })
    }
}

// PUT (Update game)
async function updateGame(req, res) {
    try {
        const game = req.body;
        const updatedGame = await gameService.update(game)
        res.json(updatedGame)
    } catch (err) {
        logger.error('Failed to update game', err)
        res.status(500).send({ err: 'Failed to update game' })

    }
}

module.exports = {
    getGames,
    getGameById,
    addGame,
    updateGame,
}
