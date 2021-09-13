const express = require('express');
const { validation } = require('../../middleware');

module.exports = context => {
  const router = express.Router()

  // Create contract
  router.post('/', validation('createContract'), async (req, res, next) => {
    try {
      const { publicAddress: user } = req.user;
      const contract = await context.db.Contract.create({ user, ...req.body });

      res.json({ success: true, contract });
    } catch (e) {
      next(e);
    }
  });

  // Get list of contracts for specific user
  router.get('/', async (req, res, next) => {
    try {
      const { publicAddress: user } = req.user;
      const contracts = await context.db.Contract.find({ user }, { _id: 1, contractAddress: 1, title: 1 });

      res.json({ success: true, contracts });
    } catch (e) {
      next(e);
    }
  });

  router.use('/:contractAddress', validation('singleContract', 'params'), (req, res, next) => {
    req.contractAddress = req.params.contractAddress;
    next();
  }, require('./singleContract')(context));

  return router
}
