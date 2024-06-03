const fs = require("fs");
const {Web3} = require("web3");
const contractBuild = require("../artifacts/contracts/abc.sol/abc.json");

async function main() {
	const web3 = new Web3(
		new Web3.providers.HttpProvider("HTTP://127.0.0.1:7545")
	);

	const accounts = await web3.eth.getAccounts();
	const contract = new web3.eth.Contract(
		contractBuild.abi,
		"0x0bf5d4eb940735c9bf53f6caa85f657ed41bc9fc"
	);
	contract.handleRevert = true;
	console.log(await contract.methods.get().call({from: accounts[0]}));
}

main().catch((error) => {
	console.error(error);
	process.exitCode = 1;
});
