const {Web3} = require("web3");
const contractBuild = require("../artifacts/contracts/multiSignedWallet.sol/MultiSignedWallet.json");

async function main() {
	const web3 = new Web3(
		new Web3.providers.HttpProvider("HTTP://127.0.0.1:7545")
	);
	web3.eth.handleRevert = true;
	const accounts = await web3.eth.getAccounts();
	const contract = new web3.eth.Contract(contractBuild.abi);
	contract.options.address = "0x2eff31de99e2b2a8345024dac73bed7fbfb93027";

	const submittedValue = 5000000000000000000n;
	const receipt = await contract.methods.executeTransaction(0).send({
		from: accounts[0],
		gas: 1000000,
		value: submittedValue,
	});
	console.log(receipt);
}

main().catch((error) => {
	console.error(error);
	process.exitCode = 1;
});
