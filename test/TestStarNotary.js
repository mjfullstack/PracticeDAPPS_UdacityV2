
// Importing the StarNotary Smart Contract ABI (JSON representation of the Smart Contract)
const StarNotary = artifacts.require("StarNotary");

var accounts;
var owner;
var starTestName = "Awesome VERSION 2 Udacity Test Star Notary Star!!!";
var starTestTokenID = 550001;

contract('StarNotary', (accs) => {
    accounts = accs;
    owner = accounts[0];
});

it('can Create a Star', async() => {
    let tokenId = 1;
    let instance = await StarNotary.deployed();
    await instance.createStar(starTestName, starTestTokenID, {from: accounts[0]});
    let starsActualName = await instance.tokenIdToStarInfo.call(starTestTokenID);
    assert.equal(starTestName, starsActualName);
    console.log("starTestName: ", starTestName, " starsActualName: ", starsActualName);
});

// ALL TESTS BELOW REQUIRE CONSOLE.LOGs FOR ME TO BE
// COMFORTABLE WITN THEIR ACCURACY!!!
it('lets user1 put up their star for sale', async() => {
    let instance = await StarNotary.deployed();
    let user1 = accounts[1];
    let starId = 220002;
    let starPrice = web3.utils.toWei(".01", "ether");
    await instance.createStar('awesome star', starId, {from: user1});
    await instance.putStarUpForSale(starId, starPrice, {from: user1});
    assert.equal(await instance.starsForSale.call(starId), starPrice);
});

it('lets user1 get the funds after the sale', async() => {
    let instance = await StarNotary.deployed();
    let user1 = accounts[1];
    let user2 = accounts[2];
    let starId = 3;
    let starPrice = web3.utils.toWei(".01", "ether");
    let balance = web3.utils.toWei(".05", "ether");
    await instance.createStar('awesome star', starId, {from: user1});
    await instance.putStarUpForSale(starId, starPrice, {from: user1});
    let balanceOfUser1BeforeTransaction = await web3.eth.getBalance(user1);
    await instance.buyStar(starId, {from: user2, value: balance});
    let balanceOfUser1AfterTransaction = await web3.eth.getBalance(user1);
    let value1 = Number(balanceOfUser1BeforeTransaction) + Number(starPrice);
    let value2 = Number(balanceOfUser1AfterTransaction);
    assert.equal(value1, value2);
});

it('lets user2 buy a star, if it is put up for sale', async() => {
    let instance = await StarNotary.deployed();
    let user1 = accounts[1];
    let user2 = accounts[2];
    let starId = 4;
    let starPrice = web3.utils.toWei(".01", "ether");
    let balance = web3.utils.toWei(".05", "ether");
    await instance.createStar('awesome star', starId, {from: user1});
    await instance.putStarUpForSale(starId, starPrice, {from: user1});
    // SEEMS UNUSED let balanceOfUser1BeforeTransaction = await web3.eth.getBalance(user2);
    // value: balance in next line tells contract how much money the 
    // purchaser, in this case user2, has in their account.
    // TBD What if they LIED???
    await instance.buyStar(starId, {from: user2, value: balance}); 
    assert.equal(await instance.ownerOf.call(starId), user2);
});

it('lets user2 buy a star and decreases its balance in ether', async() => {
    let instance = await StarNotary.deployed();
    let user1 = accounts[1];
    let user2 = accounts[2];
    let starId = 5;
    let starPrice = web3.utils.toWei(".01", "ether");
    let balance = web3.utils.toWei(".05", "ether");
    await instance.createStar('awesome star', starId, {from: user1});
    await instance.putStarUpForSale(starId, starPrice, {from: user1});
    // SEEMS UNUSED  AND MISMATCHED name VS getBsalance(Arg=user2!!!  ===> let balanceOfUser1BeforeTransaction = await web3.eth.getBalance(user2);
    const balanceOfUser2BeforeTransaction = await web3.eth.getBalance(user2);
    await instance.buyStar(starId, {from: user2, value: balance, gasPrice:0});
    const balanceAfterUser2BuysStar = await web3.eth.getBalance(user2);
    let value = Number(balanceOfUser2BeforeTransaction) - Number(balanceAfterUser2BuysStar);
    assert.equal(value, starPrice);
  });

  






/*********** From Version 1 TestStarNotary MY ATTEMPT AT CREATE STAR **************

// Importing the StarNotary Smart Contract ABI (JSON representation of the Smart Contract)
const StarNotary = artifacts.require("StarNotary");

var accounts;               // List of development accounts provided by Truffle
var owner;                  // Global variable use it in the tests cases
var starTestName = "Awesome VERSION 2 Udacity Test Star Notary Star!!!";
var starTestTokenID = 550001;

// This called the StarNotary Smart contract and initialized it
contract('StarNotary', (accs) => {
    accounts = accs;        // Assigning test accounts
    owner = accounts[0];    // Assigning the owner test account
});

it("can create star", async() => {
    let instance = await StarNotary.deployed();
    let starsActualName = await instance.createStar(starTestName, starTestTokenID);
    assert.equal(starTestName, starsActualName);
    console.log("starTestName: ", starTestName, " starsActualName: ", starsActualName);
})
*********** From Version 1 TestStarNotary MY ATTEMPT AT CREATE STAR **************/



/*********** From Version 1 TestStarNotary for examples **************
// Example test case, it will test if the contract is able to return the starName property 
// initialized in the contract constructor
it('has correct name', async () => {
    let instance = await StarNotary.deployed();     // Making sure the Smart Contract is deployed and getting the instance.
    let starName = await instance.starName.call();  // Calling the starName property
    assert.equal(starName, "Awesome Udacity Star"); // Assert if the starName property was initialized correctly
    console.log("starName: ", starName);
});

// Example test case, it will test is the Smart Contract function claimStar assigned the Star to the owner address
it('can be claimed', async () => {
    let instance = await StarNotary.deployed();     // Making sure the Smart Contract is deployed and getting the instance.
    await instance.claimStar({from: owner});        // Calling the Smart Contract function claimStar
    let starOwner = await instance.starOwner.call();// Getting the owner address
    assert.equal(starOwner, owner);                 // Verifying if the owner address match with owner of the address
    console.log("starOwner :", starOwner, "owner :", owner);
});

// Example test case, it will test is the Smart Contract function claimStar assigned the Star to the owner address and it can be changed
it('can change owners', async () => {
    let instance = await StarNotary.deployed();
    let secondUser = accounts[1];
    await instance.claimStar({from: owner});
    let starOwner = await instance.starOwner.call();
    assert.equal(starOwner, owner);
    console.log("First starOwner :", starOwner, "First owner :", owner);
    await instance.claimStar({from: secondUser});
    let secondOwner = await instance.starOwner.call();
    assert.equal(secondOwner, secondUser);
    console.log("secondOwner :", secondOwner, "secondUser :", secondUser);
});

 // Can Change Star's NAME:
 it('can change name', async () => {
    let instance = await StarNotary.deployed();     // Making sure the Smart Contract is deployed and getting the instance.
    let starName = await instance.starName.call();  // Calling the starName property
    assert.equal(starName, "Awesome Udacity Star"); // Assert if the starName property was initialized correctly
    let newStarName = "I LOVE THIS STAR!!!";
    await instance.changeName(newStarName);
    let checkStarName = await instance.starName.call();  // Calling the starName property, SECOND TIME / NAME CHANGE
    assert.equal(newStarName, checkStarName);
    console.log("newStarName :", newStarName, "checkStarName :", checkStarName);
});
*********** From Version 1 TestStarNotary for examples **************/
