
// artifacts gets the JSON format of the contract! Now you know!
const StarNotary = artifacts.require("starNotary");

module.exports = function(deployer) {
  deployer.deploy(StarNotary);
};
