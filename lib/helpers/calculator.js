function getTotalForProperty(propertyName, stats) {
  return stats.reduce((total, stat) => total + stat[propertyName], 0);
}

function getAverageScore(stats) {
  return getTotalForProperty('total', stats) / stats.length;
}

function roundToOneDecimalPlace(number) {
  return Math.round(number * 10) / 10;
}

module.exports = { getTotalForProperty, getAverageScore, roundToOneDecimalPlace };
