const {Web3} = require("web3");
const contractBuild = require("../artifacts/contracts/abc.sol/abc.json");

async function main() {
	const web3 = new Web3(
		new Web3.providers.HttpProvider("HTTP://127.0.0.1:7545")
	);
	const accounts = await web3.eth.getAccounts();
	const contract = new web3.eth.Contract(contractBuild.abi);

	contract
		.deploy({data: contractBuild.bytecode})
		.send({from: accounts[0], gas: 470000})
		.on("receipt", (receipt) => {
			console.log("Contract Address:", receipt.contractAddress);
		});
}

main().catch((error) => {
	console.error(error);
	process.exitCode = 1;
});
