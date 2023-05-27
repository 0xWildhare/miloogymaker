import { Alert, Button, Card, Col, Input, List, Menu, Row, Tabs, Dropdown, Badge } from "antd";
import "antd/dist/antd.css";
import {
  useBalance,
  useContractLoader,
  useContractReader,
  useGasPrice,
  useOnBlock,
  useUserProviderAndSigner,
} from "eth-hooks";
import { useExchangeEthPrice } from "eth-hooks/dapps/dex";
import React, { useCallback, useEffect, useState } from "react";
import { Link, Route, Switch, useLocation } from "react-router-dom";
import "./App.css";
import {
  Account,
  Address,
  Contract,
  Faucet,
  GasGauge,
  Header,
  Ramp,
  ThemeSwitch,
  NetworkDisplay,
  FaucetHint,
  Footer,
} from "./components";
import { NETWORKS, ALCHEMY_KEY } from "./constants";
import externalContracts from "./contracts/external_contracts";
// contracts
import deployedContracts from "./contracts/hardhat_contracts.json";
import { Transactor, Web3ModalSetup } from "./helpers";
import { YourMiloogys, YourFancyMiloogys, YourAccesories, FancyMiloogyPreview, About, ViewMiloogy, ViewBackground } from "./views";
import { useStaticJsonRPC } from "./hooks";
const { TabPane } = Tabs;

const { ethers } = require("ethers");
/*
    Welcome to 🏗 scaffold-eth !

    Code:
    https://github.com/scaffold-eth/scaffold-eth

    Support:
    https://t.me/joinchat/KByvmRe5wkR-8F_zz6AjpA
    or DM @austingriffith on twitter or telegram

    You should get your own Infura.io ID and put it in `constants.js`
    (this is your connection to the main Ethereum network for ENS etc.)


    🌏 EXTERNAL CONTRACTS:
    You can also bring in contract artifacts in `constants.js`
    (and then use the `useExternalContractLoader()` hook!)
*/

/// 📡 What chain are your contracts deployed to?
const targetNetwork = NETWORKS.localhost; // <------- select your target frontend network (localhost, rinkeby, xdai, mainnet)

// 😬 Sorry for all the console logging
const DEBUG = true;
const NETWORKCHECK = true;

// 🛰 providers
if (DEBUG) console.log("📡 Connecting to Mainnet Ethereum");

// 🔭 block explorer URL
const blockExplorer = targetNetwork.blockExplorer;

const web3Modal = Web3ModalSetup();

// 🛰 providers
const providers = [
  "https://eth-mainnet.gateway.pokt.network/v1/lb/611156b4a585a20035148406",
  `https://eth-mainnet.alchemyapi.io/v2/${ALCHEMY_KEY}`,
  "https://rpc.scaffoldeth.io:48544",
];

function App(props) {
  const [injectedProvider, setInjectedProvider] = useState();
  const [address, setAddress] = useState();
  const location = useLocation();

  // load all your providers
  const localProvider = useStaticJsonRPC([
    process.env.REACT_APP_PROVIDER ? process.env.REACT_APP_PROVIDER : targetNetwork.rpcUrl,
  ]);
  const mainnetProvider = useStaticJsonRPC(providers);

  const logoutOfWeb3Modal = async () => {
    await web3Modal.clearCachedProvider();
    if (injectedProvider && injectedProvider.provider && typeof injectedProvider.provider.disconnect == "function") {
      await injectedProvider.provider.disconnect();
    }
    setTimeout(() => {
      window.location.reload();
    }, 1);
  };

  /* 💵 This hook will get the price of ETH from 🦄 Uniswap: */
  const price = useExchangeEthPrice(targetNetwork, mainnetProvider);

  /* 🔥 This hook will get the price of Gas from ⛽️ EtherGasStation */
  const gasPrice = useGasPrice(targetNetwork, "fast");
  // Use your injected provider from 🦊 Metamask or if you don't have it then instantly generate a 🔥 burner wallet.
  const userProviderAndSigner = useUserProviderAndSigner(injectedProvider/*, localProvider*/);
  const userSigner = userProviderAndSigner.signer;

  useEffect(() => {
    async function getAddress() {
      if (userSigner) {
        const newAddress = await userSigner.getAddress();
        setAddress(newAddress);
      }
    }
    getAddress();
  }, [userSigner]);

  // You can warn the user if you would like them to be on a specific network
  const localChainId = localProvider && localProvider._network && localProvider._network.chainId;
  const selectedChainId =
    userSigner && userSigner.provider && userSigner.provider._network && userSigner.provider._network.chainId;

  // For more hooks, check out 🔗eth-hooks at: https://www.npmjs.com/package/eth-hooks

  // The transactor wraps transactions and provides notificiations
  const tx = Transactor(userSigner, gasPrice);

  // 🏗 scaffold-eth is full of handy hooks like this one to get your balance:
  const yourLocalBalance = useBalance(localProvider, address);

  // Just plug in different 🛰 providers to get your balance on different chains:
  const yourMainnetBalance = useBalance(mainnetProvider, address);

  // const contractConfig = useContractConfig();

  const contractConfig = { deployedContracts: deployedContracts || {}, externalContracts: externalContracts || {} };

  // Load in your local 📝 contract and read a value from it:
  const readContracts = useContractLoader(localProvider, contractConfig);

  // If you want to make 🔐 write transactions to your contracts, use the userSigner:
  const writeContracts = useContractLoader(userSigner, contractConfig, localChainId);

  // EXTERNAL CONTRACT EXAMPLE:
  //
  // If you want to bring in the mainnet DAI contract it would look like:
  const mainnetContracts = useContractLoader(mainnetProvider, contractConfig);

  // If you want to call a function on a new block
  useOnBlock(mainnetProvider, () => {
    console.log(`⛓ A new mainnet block is here: ${mainnetProvider._lastBlockNumber}`);
  });

  const [updateBalances, setUpdateBalances] = useState(0);

  //
  // 🧫 DEBUG 👨🏻‍🔬
  //
  useEffect(() => {
    if (
      DEBUG &&
      mainnetProvider &&
      address &&
      selectedChainId &&
      yourLocalBalance &&
      yourMainnetBalance &&
      readContracts &&
      writeContracts &&
      mainnetContracts
    ) {
      console.log("_____________________________________ 🏗 scaffold-eth _____________________________________");
      console.log("🌎 mainnetProvider", mainnetProvider);
      console.log("🏠 localChainId", localChainId);
      console.log("👩‍💼 selected address:", address);
      console.log("🕵🏻‍♂️ selectedChainId:", selectedChainId);
      console.log("💵 yourLocalBalance", yourLocalBalance ? ethers.utils.formatEther(yourLocalBalance) : "...");
      console.log("💵 yourMainnetBalance", yourMainnetBalance ? ethers.utils.formatEther(yourMainnetBalance) : "...");
      console.log("📝 readContracts", readContracts);
      console.log("🌍 DAI contract on mainnet:", mainnetContracts);
      console.log("🔐 writeContracts", writeContracts);
    }
  }, [
    mainnetProvider,
    address,
    selectedChainId,
    yourLocalBalance,
    yourMainnetBalance,
    readContracts,
    writeContracts,
    mainnetContracts,
  ]);

  const loadWeb3Modal = useCallback(async () => {
    const provider = await web3Modal.connect();
    setInjectedProvider(new ethers.providers.Web3Provider(provider));

    provider.on("chainChanged", chainId => {
      console.log(`chain changed to ${chainId}! updating providers`);
      setInjectedProvider(new ethers.providers.Web3Provider(provider));
    });

    provider.on("accountsChanged", () => {
      console.log(`account changed!`);
      setInjectedProvider(new ethers.providers.Web3Provider(provider));
    });

    // Subscribe to session disconnection
    provider.on("disconnect", (code, reason) => {
      console.log(code, reason);
      logoutOfWeb3Modal();
    });
  }, [setInjectedProvider]);

  useEffect(() => {
    if (web3Modal.cachedProvider) {
      loadWeb3Modal();
    }
  }, [loadWeb3Modal]);

  const faucetAvailable = localProvider && localProvider.connection && targetNetwork.name.indexOf("local") !== -1;

  const nfts = ["Hair", "Eyebrows", "Background", "Shirt"];

  const nftsSvg = {
    Hair: (
      <g class="hair" transform="translate(-12,-8) scale(0.15 0.15)">
      <path fill="#fff" stroke="#000" opacity="NaN" d="m277,138" id="svg_3"/>
      <path d="m338.65011,150.1111c0.54784,-0.51291 0.22694,-0.93783 0.77477,-1.45074c1.32262,-8.49203 1.54955,-8.70448 1.54955,-9.42986c0,-16.68358 0.2965,-16.7388 0,-17.40895c-0.4193,-0.94775 -0.77477,-1.45075 -0.77477,-1.45075c-9.71661,-16.18058 -9.97731,-16.73146 -10.84685,-18.13433c-1.4021,-2.26206 -1.54955,-2.90149 -1.54955,-4.35223c-13.71901,-13.56964 -13.39811,-13.26918 -13.94594,-13.78209c-17.45237,-7.87078 -17.81982,-7.97911 -18.5946,-7.97911c-21.63472,-6.80595 -22.46847,-7.25373 -23.24324,-7.25373c-42.61262,-9.42985 -43.38739,-10.15523 -44.93694,-10.15523c-19.36937,-2.17611 -20.14414,-2.17611 -20.91892,-2.17611c0,0 -0.77477,0 -0.77477,0c-26.89018,0.51291 -27.8919,0 -28.66667,0c-11.85913,1.84331 -12.3964,2.17611 -13.17117,2.17611c-13.02706,3.84989 -13.94595,4.35224 -14.72072,4.35224c-24.43733,16.18059 -25.01973,16.17067 -25.56757,16.68359c-17.81982,23.21194 -18.2981,23.99253 -18.5946,24.66268c-6.19819,24.66269 -6.19819,25.38806 -6.19819,26.11344c-3.0991,29.7403 -3.45457,30.2433 -3.87388,31.19104c0,4.35224 0.2965,5.13283 0,5.80299c-0.4193,0.94774 -0.77477,0.72537 -0.77477,1.45074c-7.74775,13.78209 -7.74775,15.23284 -7.74775,17.40896c-0.95278,5.78357 -0.77477,7.25373 -0.77477,7.9791c0,1.45075 0,2.17612 0,2.9015c-1.54955,7.9791 -1.54955,7.9791 -1.54955,8.70447c0,0 0,0.72538 0,0.72538c0,0.72537 0,0.72537 0,1.45074c0,13.78209 0,15.23284 0,16.68359c-0.02437,21.46228 0,23.21194 0,24.66268c3.39559,10.10002 3.32602,10.36769 3.87387,10.8806c9.2973,21.03582 8.76174,22.53866 7.74775,26.11343c-0.62886,2.21699 -0.22693,2.38859 -0.77478,2.9015c-0.54785,0.5129 -0.77477,0.72537 -0.77477,1.45074c-2.32433,2.17612 -2.32433,2.17612 -2.32433,4.35224c0,0.72538 -0.22692,1.66322 -0.77477,2.17612c-0.54785,0.51291 0,1.45075 0,1.45075c0.77477,0 0.66068,-0.12556 1.54955,-0.72538c1.40544,-0.9484 3.0073,-0.86339 5.42342,-2.17611c1.49841,-0.81412 4.41113,-2.50893 5.42343,-2.9015c1.4316,-0.55518 2.32432,-0.72537 3.09909,-0.72537c8.52253,-1.45075 10.07208,-1.45075 10.84685,-1.45075c0.77478,0 0.83374,0.2776 1.54955,0c10.20862,-2.54876 11.72466,-3.3146 14.72072,-4.35224c1.62483,-0.56273 2.18778,-1.07809 3.87388,-1.45074c1.5081,-0.33331 2.23024,-1.08332 4.64864,-1.45075c0.76478,-0.11619 2.3833,-0.44778 3.0991,-0.72537c10.07208,-4.35224 10.84685,-4.35224 11.62163,-4.35224c0,0 0.89273,-0.55519 2.32432,0c7.74775,1.45075 10.84685,1.45075 12.3964,1.45075c0,0 1.57028,0.16666 2.32432,0c1.6861,-0.37265 2.18778,-1.0781 3.87387,-1.45075c1.50811,-0.33331 3.0991,0 3.87388,0c0.77477,0 0.77477,0 0.77477,0c10.07208,-3.62687 10.29901,-3.83933 10.84685,-4.35224c3.07836,-0.89204 5.42342,-1.45075 6.97297,-1.45075c0.77478,0 1.54955,0 2.32433,0c0,0 0,0 0,-0.72537c0,0 0.54783,-0.21247 0,-0.72537c-0.54784,-0.51291 -0.77478,-0.72538 -0.77478,-0.72538c-0.77477,0 -0.77477,-0.72537 -0.77477,-1.45074c-12.04093,-11.10296 -13.17117,-10.8806 -13.94595,-11.60597c-5.42342,-3.62687 -5.48239,-4.07465 -6.1982,-4.35224c-17.13912,-3.99429 -17.81982,-4.35224 -19.36937,-4.35224c-14.18345,-4.01944 -14.00491,-4.07465 -14.72072,-4.35224c-30.99099,-8.70448 -31.76576,-9.42985 -31.76576,-9.42985c-16.68958,-9.65221 -17.81982,-9.42985 -18.5946,-10.15522c-0.77477,-0.72538 -2.67979,-1.95376 -3.0991,-2.9015c-1.54955,-5.80298 -1.54955,-6.52835 -1.54955,-6.52835c0,-0.72538 0,-1.45075 0,-2.9015c0,-0.72537 0,-1.45074 0,-1.45074c0,-0.72538 0,-1.45075 0,-2.17612c0,-1.45075 0,-1.45075 0,-2.17612c1.96886,-6.02535 3.0991,-5.80299 3.87388,-6.52836c27.11711,-8.70448 27.65438,-9.03728 28.66666,-9.42985c2.87217,-1.23828 3.87388,-0.72537 4.64865,-0.72537c8.29559,-2.68903 8.52253,-2.9015 8.52253,-3.62687c6.6175,-8.92685 7.32844,-9.20748 7.74774,-10.15522c0.77478,-4.35224 1.00172,-4.5647 1.54955,-5.07762c4.64865,-2.17612 5.42343,-2.17612 6.1982,-2.17612c5.36446,2.45372 6.1982,2.17612 6.97297,2.17612c8.29559,4.13979 8.5815,3.34928 9.2973,3.62687c1.01228,0.39257 1.54955,1.45075 1.54955,1.45075c0,0.72537 0.77478,0.72537 0.77478,0.72537c0.77477,0 1.32261,-0.21246 0.77477,-0.72537c-0.54784,-0.51292 -0.77477,-0.72538 -0.77477,-0.72538c-1.36778,-13.67166 -0.77478,-14.50746 -0.77478,-16.68358c0,-1.45075 0,-2.90149 0,-2.90149c2.32433,-12.33135 2.32433,-13.05672 2.32433,-13.05672c0.77477,-1.45075 0.77477,-2.17612 1.54955,-2.17612c0,0 0,-0.72537 0.77477,-0.72537c1.54955,-0.24179 1.54955,-0.48359 1.54955,-0.72538c7.74775,12.33135 8.52252,12.33135 8.52252,13.05672c0,0 0,-0.72537 0,-0.72537c0,-0.72537 -0.17802,-0.74478 0,-1.45075c0.39803,-1.57859 0.26744,-3.02986 1.54955,-6.52836c1.54955,-5.80298 1.73133,-7.36416 2.32433,-8.70447c0.4193,-0.94775 0.77477,-2.17612 0.77477,-3.62687c1.54955,-3.62687 1.54955,-4.35224 2.32433,-5.07761c0.77477,-0.72538 0.77477,-0.72538 0.77477,-0.72538c0,-0.72537 0.77477,-0.72537 0.77477,-0.72537c0.77478,0 1.77649,0.21246 2.32433,0.72537c0.54784,0.51292 0.77477,0.72538 0.77477,0.72538c0,0 0.22694,0.21245 0.77478,0.72537c0.54784,0.51292 0.47827,0.78059 0.77477,1.45075c1.54955,3.62686 1.54955,4.35224 1.54955,4.35224c0,0.72537 0,0.72537 0,1.45074c0,0.72538 0,1.45075 0,1.45075c0,0.72537 -0.77477,0.72537 -0.77477,0.72537c0,0.72538 0,0.72538 0,0.72538c0,0.72537 -0.22694,0.93782 -0.77478,1.45074c-0.54783,0.51292 -0.77477,0.72537 -0.77477,0.72537c0,0 -0.77478,0 -1.54955,0c0,0 -0.77478,0 -0.77478,0c0,0 0,-0.72537 0,-0.72537c0,-0.72537 0,0 0,0c1.32262,3.41441 1.54955,3.62687 2.32433,3.62687c3.0991,0.72537 3.0991,1.45074 3.87387,1.45074c0.77478,0 0.77478,0 1.54955,0c4.22989,-7.21492 4.64865,-8.70447 4.64865,-8.70447c0,-0.72538 0.54573,-2.18672 0.77478,-4.35224c0.77477,-12.33135 0.77477,-13.05672 0.77477,-13.05672c2.09739,-0.93783 3.03526,-1.17012 3.87387,0.72537c0.2965,0.67016 0.13411,1.34393 0.77478,2.17612c4.94515,6.47314 4.10081,7.46619 4.64865,7.97911c0.54783,0.51291 0.59675,0.0194 0.77477,0.72537c5.71992,10.1 5.65036,11.09305 6.1982,11.60597c0.54784,0.51292 1.00171,0.21246 1.54955,0.72537c0.54784,0.51292 0.22694,0.93783 0.77478,1.45075c0.54783,0.51292 0.77477,-0.72537 0.77477,-0.72537c0,-0.72538 0,-1.45075 0,-2.17612c0,-9.42985 0,-11.60597 0,-14.50747c0,-0.72537 0.53403,-2.9597 0,-5.07761c-0.77477,-3.62686 -0.77477,-4.35224 -0.77477,-5.07761c0,0 0,-0.72537 0,-0.72537c0,0 0.22693,0.21245 0.77477,0.72537c0.54784,0.51292 1.90502,-0.22237 2.32432,0.72537c0.2965,0.67016 -0.54783,0.93783 0,1.45075c0.54784,0.51292 1.043,-0.21365 2.32433,1.45075c1.01299,1.31582 1.54955,2.90149 1.54955,2.90149c0.77477,0.72537 0.26148,2.40099 1.54955,4.35224c0.57604,0.87262 0.9735,2.02886 1.54955,2.90149c1.28807,1.95124 0.77477,2.90149 1.54955,3.62687c0,0 0.22693,0.21245 0.77477,0.72537c0.77478,10.15522 0.77478,9.42985 0,9.42985c0,0 -0.77477,0 -0.77477,0c-5.36446,-1.72834 -5.42343,-1.45075 -5.42343,-1.45075c2.32433,1.45075 2.55127,1.66321 3.0991,2.17612c4.58968,3.90446 4.64865,3.62687 5.42343,3.62687c0,0 0.83374,0.44778 1.54955,0.72537c1.01228,0.39257 1.31204,1.05818 2.32432,1.45075c0.71581,0.27759 1.54955,0 1.54955,0c0.77477,0 0.22694,-0.21246 0.77477,-0.72537c0.54784,-0.51292 1.54955,-0.72538 2.32433,-0.72538c0,0 0.77477,-0.72537 0.77477,-0.72537c0.77478,-1.45075 2.32433,-2.90149 3.0991,-3.62687c0,0 0.77478,-0.72537 1.54955,-1.45074c0.77478,-5.80299 0.77478,-6.52836 0.77478,-6.52836c0,-0.72537 -0.59676,-1.47015 -0.77478,-2.17612c-3.64693,-7.76665 -3.57737,-8.03433 -3.87387,-8.70448c-0.77478,-2.90149 -0.77478,-2.90149 -0.77478,-3.62686c0,-0.72538 0,-1.45075 0,-2.17612c0,0 0,-0.72538 0,-0.72538c0,0 0,0 0,0.72538c0,0.72537 0.77478,0.72537 0.77478,0.72537c0.77477,0.72537 1.25305,0.78059 1.54955,1.45075c0.4193,0.94774 4.64865,2.90149 6.1982,4.35223c0.77477,0.72538 1.60851,1.89853 2.32432,2.17612c3.0991,1.45075 2.86159,1.78355 3.87387,2.17612c0.71581,0.2776 1.66527,0.34403 2.32433,0.72538c1.4737,0.85272 0.91888,1.9531 2.32432,2.90149c0.88888,0.59981 1.54955,0.72537 1.54955,0.72537c0.77478,0 1.13024,0.503 1.54955,1.45075c0.2965,0.67015 0.77478,0.72537 0.77478,1.45075c0,0.72537 0.77477,0.72537 0.77477,0c0,-0.72538 0,-0.72538 0,-1.45075c0,0 -0.58545,-0.73624 -0.77477,-2.17612c-0.39032,-2.96838 -0.77478,-4.35224 -0.77478,-5.80299c0,-7.25373 0,-7.9791 0,-7.9791c0,-0.72537 0,-1.45075 0,-1.45075c0,-0.72537 0,0 0,0c0,0.72538 2.30302,1.92042 3.0991,5.07762c0.77478,8.70447 0.47828,8.75969 0.77478,9.42985c0.4193,0.94774 0.22693,0.93783 0.77477,1.45074c0.54784,0.51292 1.54955,0 1.54955,-0.72537c1.1728,-4.48009 1.77649,-5.29007 2.32432,-5.80299c0.54784,-0.51291 0.77478,-0.72537 0.77478,-1.45074c0,0 -0.54784,-0.93783 0,-1.45075c1.54955,0 2.23024,0.35794 4.64865,0.72537c1.52954,0.23238 2.44228,0.1702 3.87387,0.72538c1.01228,0.39257 1.54955,0.72537 1.54955,0.72537c0.77478,2.17612 0.77478,2.17612 0.77478,2.90149c0,0.72538 0,0.72538 -0.77478,0.72538c-1.32261,1.96366 -1.54955,2.17612 -1.54955,2.90149c0,0 0,0.72537 0,0.72537c0,0 0,0 0.77478,0c9.84513,-4.86515 9.52423,-6.3159 10.07207,-5.80298c0.54784,0.51291 0,0.72537 0,0.72537c0.77477,1.45075 1.90502,1.95375 2.32432,2.90149c2.87216,2.68904 2.55127,3.11395 3.0991,3.62687c0.54784,0.51292 0.77478,0.72537 1.54955,0.72537c0,0 0,-0.72537 0.77478,-1.45074c0,0 0,0 0.77477,-0.72538c2.32433,-2.17612 2.55126,-3.11395 3.0991,-3.62686c0.54784,-0.51292 1.54955,0 1.54955,0c0,0.72537 -0.54784,0.93783 0,1.45074c0.54784,0.51292 0.22694,0.93783 0.77477,1.45075c0.54784,0.51292 0.77478,0.72537 0.77478,1.45075c0,4.35223 0,5.07761 0,5.07761c0,0.72537 0.54784,0.93783 0,1.45074c-0.54784,0.51292 -0.77478,0 -0.77478,0c-0.77477,0 -0.77477,0 -0.77477,0c-0.77477,0 -0.77477,0.72538 -0.77477,1.45075c9.29729,5.80299 9.29729,6.52836 9.29729,7.25373c3.0991,9.42985 3.0991,10.15523 3.87388,10.15523c0,0 0,0.72537 0,0.72537c0,0 -0.77478,0 -0.77478,0.72537l0,0l0,0l5.42343,-5.80299l2.71171,-2.90149l1.35585,-1.45074l0.67793,-0.72537l0.33896,-0.36269l0.16948,-0.18135l0.08474,-0.09067l0.04237,-0.04534l0.02119,-0.02267l0.0106,-0.01133l0.00529,-0.00567l0.00265,-0.00283l0.00133,-0.00141l0.00066,-0.00071l0.00033,-0.00036l0.00016,-0.00018l0.00008,-0.00009l0.00004,-0.00004l0.00002,-0.00002l0.00002,-0.00001l0,0l0,0l0,0l0.00001,-0.00001z" id="svg_6" fill="#87870c"/>
      <path d="m280.55814,253.08862c0,0 0.05251,0.32104 0.68992,0c10.14675,-9.82102 10.67605,-11.03093 11.03876,-11.74453c14.97621,-10.65992 15.86822,-10.90564 16.55814,-11.74453c0.68992,-1.67779 1.1826,-2.69425 2.75969,-5.03337c4.82946,-10.06674 4.82946,-10.90564 4.82946,-10.90564c0.68992,-0.8389 1.00646,-1.42063 1.37984,-2.51669c0.48784,-3.94876 0.68992,-3.35558 0.68992,-4.19448c0,0 0.20208,-0.59318 0.68992,0c0.48784,0.59318 0.20208,1.08461 0.68992,1.67779c2.12662,4.70883 3.44961,4.19448 4.13953,5.87227c0.68992,1.67779 1.37984,2.51669 1.37984,2.51669c0,0 0.26567,1.98987 2.06977,5.03337c7.03929,9.35119 7.21576,11.48737 7.58915,12.58343c2.4242,22.79801 2.75969,23.48906 2.75969,24.32796c0,0.8389 0.20208,0.24572 0.68992,0.8389c2.75969,5.87227 2.75969,6.71116 3.44961,7.55006c3.44961,4.19448 4.13953,4.19448 4.13953,4.19448c0,-2.51669 0.68992,-2.51669 0.68992,-3.35558c1.37984,-5.87227 2.06977,-5.87227 2.06977,-5.87227c0,0 0.68992,0 1.37984,0c0,0 0,0 0,0c0,0.8389 -0.48784,1.08461 0,1.67779c2.75969,4.19448 2.75969,5.03337 2.75969,5.87227c0,0 0,0.8389 0,0.8389c-1.37984,7.55006 -1.69638,7.29289 -2.06977,8.38895c-0.26403,0.77505 -0.4259,0.90274 -0.68992,1.67779c-10.34884,5.03337 -11.03876,5.03337 -11.72868,5.03337c-4.82946,-0.8389 -5.51938,-0.8389 -5.51938,-0.8389c-8.27907,1.67779 -8.27907,1.67779 -8.96899,1.67779c-0.68992,0 -0.89201,0.24572 -1.37984,0.8389c-0.48784,0.59318 0,0.8389 -0.68992,0.8389c-0.68992,0 -0.68992,0 -1.37984,0c0,0 -0.68992,0 -0.68992,0c-6.2093,-3.35558 -5.99779,-2.97069 -6.89922,-2.51669c-6.4208,3.80959 -6.2093,4.19448 -6.89922,4.19448c-0.68992,0 -0.68992,0 -1.37984,0c-0.68992,0 -1.37984,0 -1.37984,0c-8.27907,-2.51669 -8.48115,-2.7624 -8.96899,-3.35558c-12.3817,-11.29111 -14.48837,-11.74453 -15.17829,-12.58343c-0.68992,-0.8389 -1.25825,-1.24682 -2.75969,-1.67779c-10.83668,-6.46544 -11.72868,-5.87227 -11.72868,-6.71116c0,-0.8389 -0.68992,-0.8389 -0.68992,-1.67779l16.55814,-10.90564z" id="svg_7" fill="#87870c"/>
     </g>
    ),
    Eyebrows: (
      <g class="eyebrows" transform="translate(-12,-8) scale(1.5 1.5)">
      
      <path d="m8.25,17.3125l0.4375,-1.25l3.5625,-2.5625l1.8125,-0.5625l1.3125,-0.25l2.125,0.1875" stroke="#000000" fill="none"/>
      <path d="m26.4375,12l1.125,-0.75l2.375,-0.375l2.375,0.4375l0.875,1.8125" stroke="#000000" fill="none"/>
    </g>
    ),
    Background: (
      <g class="background" transform="translate(0,0) scale(1 1)">,
        <rect height="26.49937" width="43.12398" y="-0.9995" x="-1.2495"  fill="#84D3DB"/>
        <path  d="m-0.37417,21.12495" fill="#84D3DB"/>
        <path d="m6.50055,5.62559l-3.50067,1.49912c0.00082,0.00082 0.25081,2.00073 0.24999,1.99992c0.00082,0.00082 2.00073,0.12581 1.99992,0.12499c0.00082,0.00082 1.62575,0.00082 1.62493,0c0.00082,0.00082 2.00073,0.87578 1.99992,0.87496c0.00082,0.00082 3.12569,-0.99914 3.12487,-0.99996c0.00082,0.00082 3.12569,-0.12418 3.12487,-0.12499c0.00082,0.00082 1.62575,-2.37409 1.62493,-2.3749c0.00082,0.00082 -1.74911,-1.37413 -1.74993,-1.37494c0.00082,0.00082 -5.12397,-0.24917 -5.12479,-0.24999" fill="#CBFFFF"/>
        <path  d="m20,13.37527l5.12397,-2.7507l4.9998,0l4.37482,1.49994l2.74989,0.37498l1.37494,3.37486l-3.49986,1.24995l-8.24966,0.37498l-2.87488,-1.49994l-5.24979,-0.37498"  fill="#CBFFFF"/>
        <path d="m8.75046,5.75058l-4.25064,0.99914c0.00082,0.00082 0.3758,0.75079 0.37498,0.74997c0.00082,0.00082 3.00069,0.3758 2.99988,0.37498c0.00082,0.00082 1.62575,-0.49916 1.62493,-0.49998c0.00082,0.00082 0.12581,1.25077 2.00073,0.5008c1.87492,-0.74997 4.49982,-0.99996 2.99988,-1.87492l-2.8757,-0.12581" fill="#ffffff"/>
        <path  d="m21.62493,13.87525c1.24995,-0.87496 0.74997,-2.62489 3.87484,-2.3749l3.12406,0.24917l4.8748,1.49994c0.00082,0.00082 2.50071,-1.62412 2.37572,0.12581l-0.12581,1.74911l-5.74977,1.12495l-6.24974,-1.37494"  fill="#ffffff"/>
        <path  d="m-0.28054,22.38079l11.72734,1.25835l19.21083,-0.75166l9.71456,0.88671l0.12616,16.08744l-0.12616,0.88671l-40.37218,-0.12667l-0.28054,-18.24088z"  fill="#894F3F"/>
      </g>
    ),
    Shirt: (
      <g class="shirt" >
        <path stroke="#000" d="m12.18907,39.59221l0.91445,-12.13965l-1.22016,-10.60916l-0.61008,6.99986l-6.71087,-0.98435l3.96551,-13.12473l8.84615,-1.96871l4.27055,3.6093l4.77895,-3.93742l7.01591,3.06244l4.37223,9.84355l-6.66328,1.95308l-1.16607,-7.31235l-0.10168,10.71853l1.62688,13.45285l-0.20336,1.31247l-19.42085,0.21875l0.10168,-2.07808" opacity="NaN" fill="#fff"/>
        <text  textAnchor="start" fontFamily="Noto Sans JP" fontSize="3"  y="19.81168" x="16.68757"  fill="#000000">Basic</text>
        <text  textAnchor="start" fontFamily="Noto Sans JP" fontSize="3"  y="22.81162" x="17.06256"  fill="#000000">Initial</text>
        <text  textAnchor="start" fontFamily="Noto Sans JP" fontSize="3"  y="25.81156" x="16.75007"  fill="#000000">T-shirt</text>
        <text  textAnchor="start" fontFamily="Noto Sans JP" fontSize="3"  y="28.93649" x="16.81257"  fill="#000000">Concept</text>
        <text  textAnchor="start" fontFamily="Noto Sans JP" fontSize="3"  y="32.12393" x="16.93756"  fill="#000000">Here</text>
      </g>
    ),
  };

  const [fancyMiloogyContracts, setFancyMiloogyContracts] = useState([]);
  const [fancyMiloogysNfts, setFancyMiloogysNfts] = useState();
  const [selectedFancyMiloogy, setSelectedFancyMiloogy] = useState();
  const [selectedNfts, setSelectedNfts] = useState({});
  const [selectedFancyMiloogyPreview, setSelectedFancyMiloogyPreview] = useState({});
  const [fancyMiloogyPreviewActiveTab, setFancyMiloogyPreviewActiveTab] = useState("preview-Hair");

  const initCount = {
    Hair: 0,
    Eyebrows: 0,
    Background: 0,
    Shirt: 0,
  };

  const [yourNftsCount, setYourNftsCount] = useState(initCount);

  const totalSupply = useContractReader(readContracts, "Miloogys", "totalSupply");

  useEffect(() => {
    const updateFancyMiloogyContracts = async () => {
      if (readContracts.Miloogys) {
        if (DEBUG) console.log("Updating FancyMiloogy contracts address...");
        const fancyMiloogyContractsAddress = await readContracts.Miloogys.getContractsAddress();
        if (DEBUG) console.log("🤗 fancy loogie contracts:", fancyMiloogyContractsAddress);
        setFancyMiloogyContracts(fancyMiloogyContractsAddress);
      }
    };
    updateFancyMiloogyContracts();
  }, [address, readContracts.Miloogys]);

  return (
    <div className="App">
      <Header />
      <NetworkDisplay
        NETWORKCHECK={NETWORKCHECK}
        localChainId={localChainId}
        selectedChainId={selectedChainId}
        targetNetwork={targetNetwork}
        logoutOfWeb3Modal={logoutOfWeb3Modal}
        USE_NETWORK_SELECTOR={false}
      />
      <Menu style={{ textAlign: "center" }} selectedKeys={[location.pathname]} mode="horizontal">
        <Menu.Item key="/">
          <Link to="/">About</Link>
        </Menu.Item>
        <Menu.Item key="/Miloogy">
          <Link to="/Miloogy">Miloogy</Link>
        </Menu.Item>
        
        <Menu.Item key="/Maker">
          <Link to="/Maker">Maker</Link>
        </Menu.Item>
      </Menu>  
      <div>
        <div class="mascot">
          <div class="logo" style={{ margin:"auto", padding:24, textAlign:"center"}}>
            <a href="https://opensea.io/collection/miloogymaker">
            <div id="banner" style={{ margin:"auto"}}> </div>

            </a>
          </div>
        </div>
        <div class="m_box" style={{maxWidth: 740, padding:0, margin:"auto", textAlign:"left"}}>
          <div class="m_box_bar">
            <h2 style={{color:"white"}}>&nbsp; Welcome to Miloogy Maker! — 私は日本語を知りません!</h2>
          </div>
          <p style={{paddingLeft:10, paddingRight:10}}>
            Miloogy Maker is a collection of 1436 generative SVG NFT's inspired by <a href="https://miladymaker.net/">Milady Maker </a> 
             (<a href="https://remilia.org/">Remilia Collective</a>) and <a href="https://loogies.io/">Loogies</a> (<a href="https://buidlguidl.com/">BuidlGuidl</a>) - two very different communities, both with
            desire and talent to build interesting stuff on Ethereum.
          </p>
        </div>
        <div style={{margin: "auto", padding: 12}}>
          <audio controls autoplay loop>
            <source src="Lovage_Book_of_the_Month_Album_Version_.ogg" type="audio/ogg" />
            <source src="Lovage_Book_of_the_Month_Album_Version_.mp3" type="audio/mpeg" />
          </audio>
        </div>
      </div>

      <Switch>
        <Route exact path="/">
          <About
            
          />
        </Route>
        <Route exact path="/Miloogy">
          <YourMiloogys
            DEBUG={DEBUG}
            readContracts={readContracts}
            writeContracts={writeContracts}
            tx={tx}
            mainnetProvider={mainnetProvider}
            blockExplorer={blockExplorer}
            address={address}
            updateBalances={updateBalances}
            setUpdateBalances={setUpdateBalances}
            totalSupply={totalSupply}
            setSelectedFancyMiloogy={setSelectedFancyMiloogy}
            setSelectedNfts={setSelectedNfts}
            selectedFancyMiloogy={selectedFancyMiloogy}
            nfts={nfts}
            fancyMiloogysNfts={fancyMiloogysNfts}
            setFancyMiloogysNfts={setFancyMiloogysNfts}
            fancyMiloogyContracts={fancyMiloogyContracts}
          />
        </Route>
        <Route exact path="/yourFancyMiloogys">
          <YourFancyMiloogys
            DEBUG={DEBUG}
            readContracts={readContracts}
            writeContracts={writeContracts}
            tx={tx}
            mainnetProvider={mainnetProvider}
            blockExplorer={blockExplorer}
            address={address}
            updateBalances={updateBalances}
            setUpdateBalances={setUpdateBalances}
            fancyMiloogyContracts={fancyMiloogyContracts}
            fancyMiloogysNfts={fancyMiloogysNfts}
            setFancyMiloogysNfts={setFancyMiloogysNfts}
            selectedFancyMiloogy={selectedFancyMiloogy}
            setSelectedFancyMiloogy={setSelectedFancyMiloogy}
            selectedNfts={selectedNfts}
            setSelectedFancyMiloogyPreview={setSelectedFancyMiloogyPreview}
            nfts={nfts}
            setSelectedNfts={setSelectedNfts}
          />
        </Route>
        <Route exact path="/Maker">
          <div class="box" style={{maxWidth: 740, padding:0, margin:"auto", textAlign:"left"}}>
            <div class="box_bar">
              <h2 style={{color:"#2f4d0c"}}>&nbsp;Under Construction</h2>
            </div>
            <p style={{paddingLeft:10, paddingRight:10}}>
                This is sort of what this will look like once the accessory contracts are ready. First the Miloogys must mint out! If you are interested in creating SVG artwork for this please dm <a href="https://twitter.com/miloogymaker">@miloogymaker</a>
              </p>
          </div>
          <FancyMiloogyPreview
            DEBUG={DEBUG}
            readContracts={readContracts}
            writeContracts={writeContracts}
            tx={tx}
            address={address}
            updateBalances={updateBalances}
            setUpdateBalances={setUpdateBalances}
            nfts={nfts}
            nftsSvg={nftsSvg}
            fancyMiloogysNfts={fancyMiloogysNfts}
            selectedFancyMiloogy={selectedFancyMiloogy}
            selectedFancyMiloogyPreview={selectedFancyMiloogyPreview}
            setSelectedFancyMiloogyPreview={setSelectedFancyMiloogyPreview}
            selectedNfts={selectedNfts}
            setSelectedNfts={setSelectedNfts}
            setFancyMiloogysNfts={setFancyMiloogysNfts}
            fancyMiloogyPreviewActiveTab={fancyMiloogyPreviewActiveTab}
            setFancyMiloogyPreviewActiveTab={setFancyMiloogyPreviewActiveTab}
          />
          <Tabs defaultActiveKey="/" tabPosition="left" id="tabs-accesories" tabBarExtraContent={
            <Alert
              message="Choose an accesory type and mint a new NFT."
              description={
                <p>
                  If:
                  <ul>
                    <li>You have a <strong>Miloogy selected to wear</strong> and</li>
                    <li>The Miloogy <strong>doesn't have this kind of accesory</strong>,</li>
                  </ul>
                  Then, you will be able to preview the accesory on your <strong>Miloogy</strong>.
                </p>
              }
              type="info"
            />
          }>
            {nfts.map(function (nft) {
              return (
                <TabPane
                  tab={
                    <div class="tab-item">
                      <svg width="40" height="40" xmlns="http://www.w3.org/2000/svg" style={{ float: "left" }}>
                        {nftsSvg[nft]}
                      </svg>
                      <Badge count={yourNftsCount[nft]}>
                        <p style={{ float: "left", marginBottom: 0, fontSize: 24, fontWeight: "bold", marginLeft: 5 }}>{nft}</p>
                      </Badge>
                    </div>
                  }
                  key={nft}
                >
                  <YourAccesories
                    DEBUG={DEBUG}
                    readContracts={readContracts}
                    writeContracts={writeContracts}
                    tx={tx}
                    mainnetProvider={mainnetProvider}
                    blockExplorer={blockExplorer}
                    address={address}
                    updateBalances={updateBalances}
                    setUpdateBalances={setUpdateBalances}
                    nft={nft}
                    fancyMiloogysNfts={fancyMiloogysNfts}
                    selectedFancyMiloogy={selectedFancyMiloogy}
                    selectedNfts={selectedNfts}
                    setSelectedNfts={setSelectedNfts}
                    setFancyMiloogyPreviewActiveTab={setFancyMiloogyPreviewActiveTab}
                  />
                </TabPane>
              );
            })}
          </Tabs>
        </Route>
        
        <Route exact path="/debug">
          <div style={{ padding: 32 }}>
            <Address value={readContracts && readContracts.Miloogys && readContracts.Miloogys.address} />
          </div>
          <Contract
            name="Miloogys"
            price={price}
            signer={userSigner}
            provider={localProvider}
            address={address}
            blockExplorer={blockExplorer}
            contractConfig={contractConfig}
          />
          <Contract
            name="Background"
            price={price}
            signer={userSigner}
            provider={localProvider}
            address={address}
            blockExplorer={blockExplorer}
            contractConfig={contractConfig}
          />
          <Contract
            name="Eyebrows"
            price={price}
            signer={userSigner}
            provider={localProvider}
            address={address}
            blockExplorer={blockExplorer}
            contractConfig={contractConfig}
          />
        </Route>
        <Route path="/token/:id">
          <ViewMiloogy
              readContracts={readContracts}
              blockExplorer={blockExplorer}
              mainnetProvider={mainnetProvider}
              targetNetwork={targetNetwork}
              totalSupply={totalSupply}
            />
        </Route>
        <Route path="/background/:id">
          <ViewBackground
              readContracts={readContracts}
              blockExplorer={blockExplorer}
              mainnetProvider={mainnetProvider}
              targetNetwork={targetNetwork}
              totalSupply={totalSupply}
            />
        </Route>
      </Switch>
            
      <Footer />

      <ThemeSwitch />

      {/* 👨‍💼 Your account is in the top right with a wallet at connect options */}
      <div style={{ position: "fixed", textAlign: "right", right: 0, top: 0, padding: 10 }}>
        <Account
          address={address}
          localProvider={localProvider}
          userSigner={userSigner}
          mainnetProvider={mainnetProvider}
          price={price}
          web3Modal={web3Modal}
          loadWeb3Modal={loadWeb3Modal}
          logoutOfWeb3Modal={logoutOfWeb3Modal}
          blockExplorer={blockExplorer}
        />
        <FaucetHint localProvider={localProvider} targetNetwork={targetNetwork} address={address} />
      </div>

      {/* 🗺 Extra UI like gas price, eth price, faucet, and support: */}
      {targetNetwork.name == "mainnet" ? "" :
      <div style={{ position: "fixed", textAlign: "left", left: 0, bottom: 20, padding: 10 }}>
        
          <Row align="middle" gutter={[4, 4]}>
            <Col span={8}>
              <Ramp price={price} address={address} networks={NETWORKS} />
            </Col>

            <Col span={8} style={{ textAlign: "center", opacity: 0.8 }}>
              <GasGauge gasPrice={gasPrice} />
            </Col>
            <Col span={8} style={{ textAlign: "center", opacity: 1 }}>
              <Button
                onClick={() => {
                  window.open("https://t.me/joinchat/KByvmRe5wkR-8F_zz6AjpA");
                }}
                size="large"
                shape="round"
              >
                <span style={{ marginRight: 8 }} role="img" aria-label="support">
                  💬
                </span>
                Support
              </Button>
            </Col>
          </Row>

          <Row align="middle" gutter={[4, 4]}>
            <Col span={24}>
              {
                // if the local provider has a signer, let's show the faucet:  
                faucetAvailable ? (
                  <Faucet localProvider={localProvider} price={price} ensProvider={mainnetProvider} />
                ) : (
                  ""
                )
              }
            </Col>
          </Row>
          
      </div>
    }

    </div>
  );
}

export default App;
