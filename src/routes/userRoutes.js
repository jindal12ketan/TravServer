const express = require('express');
const {
  createUser,
  getUsers,
  getUserByEmail,
  deleteUser,
} = require('../controllers/userController');

const router = express.Router();

router.post('/create', createUser);
router.get('/', getUsers);
router.get('/:email', getUserByEmail);
router.delete('/:email', deleteUser);

module.exports = router;
