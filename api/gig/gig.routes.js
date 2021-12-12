const express = require('express')
const { requireAuth, requireAdmin } = require('../../middlewares/requireAuth.middleware')
const { log } = require('../../middlewares/logger.middleware')
const { getGigs, getGigById, addGig, updateGig, removeGig, addReview } = require('./gig.controller')
const router = express.Router()

// middleware that is specific to this router
// router.use(requireAuth)

router.get('/', getGigs)
// router.get('/', log, getGigs)
router.get('/:id', getGigById)
// router.post('/', requireAuth, requireAdmin, addGig)
router.post('/', addGig)
// router.put('/:id', requireAuth, requireAdmin, updateGig)
router.put('/:id', updateGig)
// router.delete('/:id', requireAuth, requireAdmin, removeGig)
router.delete('/:id', removeGig)

module.exports = router