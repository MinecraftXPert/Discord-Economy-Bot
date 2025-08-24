const { randomGen } = require("./db/helper");

let costOfSolana = randomGen(150, 200).toString();

function updateSolana() {
  costOfSolana = randomGen(150, 200).toString();
}

setInterval(updateSolana, 5 * 60 * 1000);

module.exports = { getCostOfSolana: () => costOfSolana };
