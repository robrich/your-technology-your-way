const express = require('express');
const router = express.Router();

router.get('/', async function(req, res) {
  const version = {
    language: 'JavaScript',
    runtime: 'Express',
    version: process.version.toString()
  }
  res.json(version);
});

module.exports = router;
