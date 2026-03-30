const express = require('express');
const router = express.Router();
const courtController = require('../controllers/courts.c');
const { verifyToken, isAdmin } = require('../middlewares/auth.m');

router.get('/', courtController.getCourts);
router.get('/:id', courtController.getCourtById);
router.post('/', verifyToken, isAdmin, courtController.createCourt);
router.put('/:id', verifyToken, isAdmin, courtController.updateCourt);
router.delete('/:id', verifyToken, isAdmin, courtController.deleteCourt);

module.exports = router;