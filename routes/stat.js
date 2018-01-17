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
      res.json({ message: 'Stat persisted', stat });
    }
  });
}

function aggregateStats(req, res) {
    let requestedCourseId = req.params.courseId;
    let requestedUserId = req.header('user-Id');

    Stat.find({ courseId: requestedCourseId,
                userId: requestedUserId
    }, (err, stats) => {
        if(err) res.send(err);

        let totalTimeStudied = stats.reduce((acc, stat) => acc + stat.timeStudied, 0);
        res.json({
          timeStudied: totalTimeStudied
        });

    });
}

module.exports = { createStat, aggregateStats };
