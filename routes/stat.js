let mongoose = require('mongoose');
let Stat = require('../models/stat');

function createStat(req, res) {
  let courseId = req.params.courseId;
  let userId = req.header('user-Id');
  let total = req.body.total;
  let timeStudied = req.body.timeStudied;
  let newStat = new Stat({ userId, courseId, total, timeStudied });

  newStat.save((err,stat) => {
    if(err) {
      res.send(err);
    }
    else {
      res.json({message: 'Stat persisted', stat });
    }
  });
}

module.exports = { createStat };
