const express = require('express');
const { createTodo, markDone, getTodos } = require('../controllers/todoControllers');
const { protectRoute } = require('../middlewares/protectRoute');
const router = express.Router();

// these routes needs to be protected right ?
router.post('/create', protectRoute, createTodo);
router.put('/mark/:id', protectRoute, markDone);
router.get('/getTodo', protectRoute, getTodos);

module.exports = router;