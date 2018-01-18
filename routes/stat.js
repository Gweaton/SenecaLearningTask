let mongoose = require('mongoose');
let Stat = require('../lib/models/stat');
let calculator = require('../lib/helpers/calculator');

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
      res.statusCode = 201;
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

        if(stats.length === 0) {
          res.json({ message: 'No stats found for requested courseId or UserId' });
        } else {
          res.json({
            timeStudied: calculator.getTotalForProperty('timeStudied', stats),
            averageScore: calculator.roundToOneDecimalPlace(calculator.getAverageScore(stats))
          });
        }
    });
}

module.exports = { createStat, aggregateStats };
