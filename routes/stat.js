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
            timeStudied: getTotalForProperty('timeStudied', stats),
            averageScore: roundToOneDecimalPlace(getAverageScore(stats))
          });
        }
    });
}

function getTotalForProperty(propertyName, stats) {
  return stats.reduce((total, stat) => total + stat[propertyName], 0);
}

function getAverageScore(stats) {
  return getTotalForProperty('total', stats) / stats.length;
}

function roundToOneDecimalPlace(number) {
  return Math.round(number * 10) / 10;
}

module.exports = { createStat, aggregateStats };
