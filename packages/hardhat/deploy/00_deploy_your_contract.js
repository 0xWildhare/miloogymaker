// deploy/00_deploy_your_contract.js

const { ethers } = require("hardhat");

const localChainId = "31337";

module.exports = async ({ getNamedAccounts, deployments, getChainId }) => {
  const { deploy } = deployments;
  const { deployer } = await getNamedAccounts();
  const chainId = await getChainId();

  //const miloogys = await ethers.getContract("Miloogys", deployer);
  // const eyebrows = await ethers.getContract("Eyebrows", deployer);
  // const eb = await ethers.getContract("Eb", deployer);
  let miloogys;
  if (chainId == "31337"){
    miloogys = await deploy("Miloogys", {
      from: deployer,
      log: true,
      args: [
        "0xa53A6fE2d8Ad977aD926C485343Ba39f32D3A3F6",
        "0xbd5f333c25ba5d6da3863c00ebb219a4f3420325449d1b17b29abff0954bfec6"
      ]
    });} else{
      miloogys = await ethers.getContract("Miloogys", deployer);
    }

  // const background = await deploy("Background", {
  //   from: deployer,
  //   log: true,
  //   args: [
  //     "0xa53A6fE2d8Ad977aD926C485343Ba39f32D3A3F6",
  //     miloogys.address
  //   ]
  // });

  // const bg = await deploy("Bg", {
  //   from: deployer,
  //   log: true,
  //   args: [
  //     miloogys.address,
  //     background.address
  //   ]
  // });

  // const eyebrows = await deploy("Eyebrows", {
  //   from: deployer,
  //   log: true,
  //   args: [
  //     "0xa53A6fE2d8Ad977aD926C485343Ba39f32D3A3F6",
  //     miloogys.address
  //   ]
  // });

  const hair = await deploy("Hair", {
    from: deployer,
    log: true,
    args: [
      "0xa53A6fE2d8Ad977aD926C485343Ba39f32D3A3F6",
      miloogys.address
    ]
  });

  

  // const eb = await deploy("Eb", {
  //   from: deployer,
  //   log: true,
  //   args: [
  //     miloogys.address,
  //     eyebrows.address
  //   ]
  // });

    /*

  const mustache = await deploy("Mustache", {
    from: deployer,
    log: true,
  });

  const contactLenses = await deploy("ContactLenses", {
    from: deployer,
    log: true,
  });

  await deploy("FancyMiloogy", {
    from: deployer,
    args: [miloogys.address],
    log: true,
  });
*/
  //const Miloogys = await ethers.getContract("Miloogys", deployer);
  //await Miloogys.addNft(bow.address);
  //await Miloogys.addNft(mustache.address);
  //await Miloogys.addNft(contactLenses.address);
  //await Miloogys.addNft(eyelash.address);

  /*
    To take ownership of yourContract using the ownable library uncomment next line and add the 
    address you want to be the owner. 
  */
    //Miloogys.transferOwnership("0xa53A6fE2d8Ad977aD926C485343Ba39f32D3A3F6");

    //const yourContract = await ethers.getContractAt('YourContract', "0xaAC799eC2d00C013f1F11c37E654e59B0429DF6A") //<-- if you want to instantiate a version of a contract at a specific address!
  

  /*
  //If you want to send value to an address from the deployer
  const deployerWallet = ethers.provider.getSigner()
  await deployerWallet.sendTransaction({
    to: "0x34aA3F359A9D614239015126635CE7732c18fDF3",
    value: ethers.utils.parseEther("0.001")
  })
  */

  /*
  //If you want to send some ETH to a contract on deploy (make your constructor payable!)
  const yourContract = await deploy("YourContract", [], {
  value: ethers.utils.parseEther("0.05")
  });
  */

  /*
  //If you want to link a library into your contract:
  // reference: https://github.com/austintgriffith/scaffold-eth/blob/using-libraries-example/packages/hardhat/scripts/deploy.js#L19
  const yourContract = await deploy("YourContract", [], {}, {
   LibraryName: **LibraryAddress**
  });
  */

  // Verify your contracts with Etherscan
  // You don't want to verify on localhost
  
  if (chainId !== localChainId) {
  //   try{
  //     await run("verify:verify", {
  //       address: background.address,
  //       contract: "contracts/Background.sol:Background",
  //       constructorArguments: [
  //         "0xa53A6fE2d8Ad977aD926C485343Ba39f32D3A3F6",
  //         miloogys.address
  //       ],
  //     });
  //   }catch(e){
  //     console.log(e);
  //   }
  //   try{
  //     await run("verify:verify", {
  //       address: eyebrows.address,
  //       contract: "contracts/Eyebrows.sol:Eyebrows",
  //       constructorArguments: [
  //         "0xa53A6fE2d8Ad977aD926C485343Ba39f32D3A3F6",
  //         miloogys.address
  //       ],
  //     });
  //   }catch(e){
  //     console.log(e);
  //   }
    // try{
    //   await run("verify:verify", {
    //     address: bg.address,
    //     contract: "contracts/Bg.sol:Bg",
    //     constructorArguments: [
    //       miloogys.address,
    //       background.address
    //     ],
    //   });
    // }catch(e){
    //   console.log(e);
    // }
    try{
      await run("verify:verify", {
        address: hair.address,
        contract: "contracts/Hair.sol:Hair",
        constructorArguments: [
          "0xa53A6fE2d8Ad977aD926C485343Ba39f32D3A3F6",
          miloogys.address
        ],
      });
    }catch(e){
      console.log(e);
    }
  }
  
};
module.exports.tags = ["Miloogys"];
