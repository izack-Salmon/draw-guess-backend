const express = require('express')
const { getPlayers, getPlayerById, addPlayer, updatePlayer, getPendingPlayers } = require('./player.controller')
const router = express.Router()

router.get('/', getPlayers)
router.get('/pending', getPendingPlayers)
router.post('/', addPlayer)
router.get('/:id', getPlayerById)
router.put('/:id', updatePlayer)


module.exports = router