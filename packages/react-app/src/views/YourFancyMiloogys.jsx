import React, { useEffect, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import { Alert, Button, Card, Col, Input, List, Menu, Row, Tabs, Dropdown, Badge } from "antd";
import { DownOutlined } from "@ant-design/icons";
import { Address, AddressInput } from "../components";
import { ethers } from "ethers";

function YourFancyMiloogys({
  DEBUG,
  readContracts,
  writeContracts,
  priceToMint,
  yourCollectibles,
  tx,
  mainnetProvider,
  blockExplorer,
  updateBalances,
  setUpdateBalances,
  address,
  fancyMiloogyContracts,
  fancyMiloogysNfts,
  setFancyMiloogysNfts,
  selectedFancyMiloogy,
  setSelectedFancyMiloogy,
  nfts,
  setSelectedNfts,
}) {
  const [fancyMiloogyBalance, setFancyMiloogyBalance] = useState(0);
  const [yourFancyMiloogyBalance, setYourFancyMiloogyBalance] = useState(0);
  const [yourFancyMiloogys, setYourFancyMiloogys] = useState();
  const [transferToAddresses, setTransferToAddresses] = useState({});
  const [loadingFancyMiloogys, setLoadingFancyMiloogys] = useState(true);
  const history = useHistory();

  useEffect(() => {
    const updateBalances = async () => {
      if (DEBUG) console.log("Updating balances...");
      if (readContracts.FancyMiloogy) {
        const fancyMiloogyNewBalance = await readContracts.Miloogys.balanceOf(address);
        if (DEBUG) console.log("NFT: FancyMiloogy - Balance: ", fancyMiloogyNewBalance);
        const yourFancyMiloogyNewBalance = fancyMiloogyNewBalance && fancyMiloogyNewBalance.toNumber && fancyMiloogyNewBalance.toNumber();
        setFancyMiloogyBalance(fancyMiloogyNewBalance);
        setYourFancyMiloogyBalance(yourFancyMiloogyNewBalance);
      } else {
        if (DEBUG) console.log("Contracts not defined yet.");
      }
    };
    updateBalances();
  }, [address, readContracts.FancyMiloogy, updateBalances]);

  useEffect(() => {
    const updateYourCollectibles = async () => {
      setLoadingFancyMiloogys(true);
      const fancyMiloogyUpdate = [];
      const fancyMiloogysNftsUpdate = {};
      for (let tokenIndex = 0; tokenIndex < yourFancyMiloogyBalance; tokenIndex++) {
        try {
          const tokenId = await readContracts.Miloogys.tokenOfOwnerByIndex(address, tokenIndex);
          if (DEBUG) console.log("Getting FancyMiloogy tokenId: ", tokenId);
          const tokenURI = await readContracts.Miloogys.tokenURI(tokenId);
          if (DEBUG) console.log("tokenURI: ", tokenURI);
          const jsonManifestString = atob(tokenURI.substring(29));

          try {
            const jsonManifest = JSON.parse(jsonManifestString);
            fancyMiloogyUpdate.push({ id: tokenId, uri: tokenURI, owner: address, ...jsonManifest });
            fancyMiloogysNftsUpdate[tokenId] = {};
            if (DEBUG) console.log("fancyMiloogyContracts: ", fancyMiloogyContracts);
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
      setYourFancyMiloogys(fancyMiloogyUpdate.reverse());
      setFancyMiloogysNfts(fancyMiloogysNftsUpdate);
      setLoadingFancyMiloogys(false);
    };
    updateYourCollectibles();
  }, [address, yourFancyMiloogyBalance]);

  return (
    <>
      <div style={{ maxWidth: 820, margin: "auto", marginTop: 32, paddingBottom: 32 }}>
        <div style={{ fontSize: 16 }}>
          <p>
            Select the <strong>FancyMiloogy</strong> you want to wear with accesories.
          </p>
          <p>
            Mint some <strong>accesories</strong> and then you can <strong>add</strong> them to your Miloogys.
          </p>
        </div>
      </div>

      <div className="your-fancy-miloogys" style={{ width: 515, margin: "0 auto", paddingBottom: 256 }}>
        <List
          bordered
          loading={loadingFancyMiloogys}
          dataSource={yourFancyMiloogys}
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
                            history.push("/yourAccesories");
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

export default YourFancyMiloogys;
