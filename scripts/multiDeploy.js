const {Web3} = require("web3");
const contractBuild = require("../artifacts/contracts/multiSignedWallet.sol/MultiSignedWallet.json");

async function main() {
	const web3 = new Web3(
		new Web3.providers.HttpProvider("HTTP://127.0.0.1:7545")
	);
	const accounts = await web3.eth.getAccounts();
	const contract = new web3.eth.Contract(contractBuild.abi);

	contract
		.deploy({
			data: contractBuild.bytecode,
			arguments: [[accounts[0]], 1],
		})
		.send({from: accounts[0], gas: 1000000})
		.on("receipt", (receipt) =>
			console.log("Contract Address:", receipt.contractAddress)
		);
}

main().catch((error) => {
	console.log(error);
	process.exitCode = 1;
});
