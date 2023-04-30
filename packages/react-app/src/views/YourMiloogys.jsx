import React, { useEffect, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import { Button, Card, Dropdown, Menu, List } from "antd";
import { DownOutlined } from "@ant-design/icons"
import { Address, AddressInput } from "../components";
import { ethers } from "ethers";
import { useContractReader } from "eth-hooks";
import { MerkleTree } from 'merkletreejs';

const snap= require("../snapshot_sorted.json");
//console.log("snap", snap);

function YourMiloogys({
  DEBUG,
  readContracts,
  writeContracts,
  tx,
  mainnetProvider,
  blockExplorer,
  address,
  updateBalances,
  setUpdateBalances,
  totalSupply,
  setSelectedFancyMiloogy,
  selectedFancyMiloogy,
  nfts,
  fancyMiloogysNfts,
  setSelectedNfts,
  setFancyMiloogysNfts,
  fancyMiloogyContracts
}) {
  const history = useHistory();

  const [loogieBalance, setMiloogyBalance] = useState(0);
  const [yourMiloogyBalance, setYourMiloogyBalance] = useState(0);
  const [yourMiloogys, setYourMiloogys] = useState();
  const [yourMiloogysApproved, setYourMiloogysApproved] = useState({});
  const [transferToAddresses, setTransferToAddresses] = useState({});
  const [loadingOptimisticMiloogys, setLoadingOptimisticMiloogys] = useState(true);
  const [addresses, setAddresses] = useState([]);
  const [tree, setTree] = useState();
  const [path, setPath] = useState([]);

  const freeMints = useContractReader(readContracts, "Miloogys", "freeMints");

  useEffect(() => {
    const snapshot = [];
    for(let i=0; i<snap.length; i++){
      snapshot.push(snap[i].address);
    }
    setAddresses(snapshot);
    if (DEBUG) console.log("snapshot", snapshot);
    const leaves = snapshot.map(x => ethers.utils.keccak256(x));
    if (DEBUG) console.log("leaves", leaves);
    const newTree = new MerkleTree(leaves, ethers.utils.keccak256, { sort: true });
    if (DEBUG) console.log("tree", newTree);
    const root = newTree.getHexRoot();
    if (DEBUG) console.log("root", root);
    setTree(newTree);
  }, []);

  useEffect(() => {
    const newPath = tree&&address&&tree.getHexProof(ethers.utils.keccak256(address));
    setPath(newPath);
    if (DEBUG) console.log("path", newPath);
  }, [address, tree]);

 
  const priceToMint = useContractReader(readContracts, "Miloogys", "price");
  if (DEBUG) console.log("🤗 priceToMint:", priceToMint);

  if (DEBUG) console.log("🤗 totalSupply:", totalSupply);
  const miloogysLeft = 1436 - totalSupply;

  useEffect(() => {
    const updateBalances = async () => {
      if (DEBUG) console.log("Updating balances...");
      if (readContracts.Miloogys && address) {
        const loogieNewBalance = await readContracts.Miloogys.balanceOf(address);
        const yourMiloogyNewBalance = loogieNewBalance && loogieNewBalance.toNumber && loogieNewBalance.toNumber();
        if (DEBUG) console.log("NFT: Miloogy - Balance: ", loogieNewBalance);
        setMiloogyBalance(loogieNewBalance);
        setYourMiloogyBalance(yourMiloogyNewBalance);
      } else {
        if (DEBUG) console.log("Contracts not defined yet.");
      }
    };
    updateBalances();
  }, [address, readContracts.Miloogys, updateBalances]);

  useEffect(() => {
    const updateYourCollectibles = async () => {
      setLoadingOptimisticMiloogys(true);
      const loogieUpdate = [];
      const loogieApproved = {};
      const fancyMiloogysNftsUpdate = {};
      for (let tokenIndex = 0; tokenIndex < yourMiloogyBalance; tokenIndex++) {
        try {
          const tokenId = await readContracts.Miloogys.tokenOfOwnerByIndex(address, tokenIndex);
          if (DEBUG) console.log("Getting Miloogy tokenId: ", tokenId);
          const tokenURI = await readContracts.Miloogys.tokenURI(tokenId);
          if (DEBUG) console.log("tokenURI: ", tokenURI);
          const jsonManifestString = Buffer.from(tokenURI.substring(29), 'base64');

          try {
            const jsonManifest = JSON.parse(jsonManifestString);
            loogieUpdate.push({ id: tokenId, uri: tokenURI, owner: address, ...jsonManifest });
            fancyMiloogysNftsUpdate[tokenId] = {};
            let approved = await readContracts.Miloogys.getApproved(tokenId);
            loogieApproved[tokenId] = approved;
            for (let contractIndex = 0; contractIndex < fancyMiloogyContracts.length; contractIndex++) {
              const contractAddress = fancyMiloogyContracts[contractIndex];
              const nftId = await readContracts.Miloogys.nftId(contractAddress, tokenId);
              fancyMiloogysNftsUpdate[tokenId][contractAddress] = nftId.toString();
              if (DEBUG) console.log("fancyMiloogysNftsUpdate: ", fancyMiloogysNftsUpdate);
            }
          } catch (e) {
            console.log(e);
          }
        } catch (e) {
          console.log(e);
        }
      }
      setYourMiloogys(loogieUpdate.reverse());
      setYourMiloogysApproved(loogieApproved);
      setLoadingOptimisticMiloogys(false);
      //setYourFancyMiloogys(fancyMiloogyUpdate.reverse());
      setFancyMiloogysNfts(fancyMiloogysNftsUpdate);
      //setLoadingFancyMiloogys(false);
    };
    updateYourCollectibles();
  }, [address, yourMiloogyBalance]);

  

  return (
    <>
      <div style={{ maxWidth: 515, margin: "0 auto"}}>
        <Button
          onClick={async () => {
            const priceRightNow = await readContracts.Miloogys.price();
            try {
              tx(writeContracts.Miloogys.mintItem({ value: priceRightNow }), function (transaction) {
                setUpdateBalances(updateBalances + 1);
              });
            } catch (e) {
              console.log("mint failed", e);
            }
          }}
        >
          MINT 1 for Ξ{priceToMint && (+ethers.utils.formatEther(priceToMint)).toFixed(4)}
        </Button>
        &nbsp;&nbsp;
        <Button
          type="primary"
          onClick={async () => {
            const priceRightNow = await readContracts.Miloogys.price();
            try {
              tx(writeContracts.Miloogys.mintMultiple(5, { value: priceRightNow.mul(5)}), function (transaction) {
                setUpdateBalances(updateBalances + 5);
              });
            } catch (e) {
              console.log("mint failed", e);
            }
          }}
        >
          MINT 5 for Ξ{priceToMint && (+ethers.utils.formatEther(priceToMint)).toFixed(4) * 5}
        </Button>
        &nbsp;&nbsp;
        <Button
          type="secondary"
          onClick={async () => {
            const priceRightNow = await readContracts.Miloogys.price();
            try {
              tx(writeContracts.Miloogys.mintMultiple(10, { value: priceRightNow.mul(10)}), function (transaction) {
                setUpdateBalances(updateBalances + 10);
              });
            } catch (e) {
              console.log("mint failed", e);
            }
          }}
        >
          MINT 10 for Ξ{priceToMint && (+ethers.utils.formatEther(priceToMint)).toFixed(4) * 10}
        </Button>
      
        <p style={{ fontWeight: "bold", padding:10}}>
          { totalSupply && totalSupply.toNumber() } out of 1436 have been minted
        </p>
      </div>

      {path&&path.length > 0 ?
        <div style={{ maxWidth: 515, margin: "0 auto", paddingBottom: 32 }}>
          <h2>You have a free mint!</h2>
          <Button
            type="primary"
            onClick={async () => {
              try {
                tx(writeContracts.Miloogys.freeMint(path), function (transaction) {
                  setUpdateBalances(updateBalances + 1);
                });
              } catch (e) {
                console.log("mint failed", e);
              }
            }}
          >
            MINT 1 for FREE!
          </Button>
          <p style={{ fontWeight: "bold", padding:10}}>
            { freeMints && freeMints.toNumber() } out of 656 have been minted
          </p>
        </div>
        : ""
        }
      <div style={{ width: 515, margin: "0 auto", paddingBottom: 256 }}>
        <List
          bordered
          loading={loadingOptimisticMiloogys}
          dataSource={yourMiloogys}
          renderItem={item => {
            const id = item.id.toNumber();

            return (
              <List.Item key={id + "_" + item.uri + "_" + item.owner}>
                <Card
                  title={
                    <div>
                      <span style={{ fontSize: 18, marginRight: 8 }}>{item.name}</span>
                      {selectedFancyMiloogy != id ? (
                        <Button
                          className="action-inline-button"
                          onClick={() => {
                            setSelectedFancyMiloogy(id);
                            setSelectedNfts({});
                            history.push("/Maker");
                          }}
                        >
                          Select to wear
                        </Button>
                      ) : (
                        <Button className="action-inline-button" disabled>
                          Selected
                        </Button>
                      )}
                      <Dropdown overlay={
                        <Menu>
                          <Menu.Item key="downgrade">
                            <Button
                              className="fancy-loogie-action-button action-button"
                              onClick={() => {
                                tx(writeContracts.Miloogys.downgradeMiloogy(id), function (transaction) {
                                  setUpdateBalances(updateBalances + 1);
                                });
                              }}
                            >
                              Downgrade
                            </Button>
                          </Menu.Item>
                          {nfts.map(function (nft) {
                            return fancyMiloogysNfts &&
                              fancyMiloogysNfts[id] &&
                              readContracts &&
                              readContracts[nft] &&
                              fancyMiloogysNfts[id][readContracts[nft].address] > 0 && (
                                <Menu.Item key={"remove-"+nft}>
                                  <Button
                                    className="fancy-loogie-action-button action-button"
                                    onClick={() => {
                                      tx(writeContracts.Miloogys.removeNftFromMiloogy(readContracts[nft].address, id), function (transaction) {
                                        setFancyMiloogysNfts(prevState => ({
                                          ...prevState,
                                          [id]: {
                                            ...prevState[id],
                                            [readContracts[nft].address]: 0
                                          }
                                        }));
                                        setUpdateBalances(updateBalances + 1);
                                      });
                                    }}
                                  >
                                    Remove {nft}
                                  </Button>
                                </Menu.Item>
                              );
                          })}
                        </Menu>
                      }>
                        <Button>
                          Actions <DownOutlined />
                        </Button>
                      </Dropdown>
                    </div>
                  }
                >
                  <img src={item.image} />
                  <div style={{ height: 90 }}>{item.description}</div>
                  <div style={{ height: 90 }}>
                    owner:{" "}
                    <Address
                      address={item.owner}
                      ensProvider={mainnetProvider}
                      blockExplorer={blockExplorer}
                      fontSize={16}
                    />
                    <AddressInput
                      ensProvider={mainnetProvider}
                      placeholder="transfer to address"
                      value={transferToAddresses[id]}
                      onChange={newValue => {
                        const update = {};
                        update[id] = newValue;
                        setTransferToAddresses({ ...transferToAddresses, ...update });
                      }}
                    />
                    
                    <Button
                      style={{marginTop:10}}
                      onClick={() => {
                        tx(writeContracts.Miloogys.transferFrom(address, transferToAddresses[id], id), function (transaction) {
                          setUpdateBalances(updateBalances + 1);
                        });
                      }}
                    >
                      Transfer
                    </Button>
                  </div>
                </Card>
              </List.Item>
            );
          }}
        />
      </div>
    </>
  );
}

export default YourMiloogys;
