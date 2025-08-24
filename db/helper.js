function randomGen(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

function floatRandomGen(min, max) {
  return Math.random() * (max - min) + min;
}

module.exports = { randomGen, floatRandomGen };
