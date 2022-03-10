const express = require('express')
const { getGames, getGameById, addGame, updateGame } = require('./game.controller')
const router = express.Router()

router.get('/', getGames)
router.post('/', addGame)
router.get('/:id', getGameById)
router.put('/:id', updateGame)


module.exports = router