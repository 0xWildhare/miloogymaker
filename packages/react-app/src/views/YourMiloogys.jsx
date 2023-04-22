import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button, Card, List } from "antd";
import { Address, AddressInput } from "../components";
import { ethers } from "ethers";
import { useContractReader } from "eth-hooks";

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
}) {
  const [loogieBalance, setMiloogyBalance] = useState(0);
  const [yourMiloogyBalance, setYourMiloogyBalance] = useState(0);
  const [yourMiloogys, setYourMiloogys] = useState();
  const [yourMiloogysApproved, setYourMiloogysApproved] = useState({});
  const [transferToAddresses, setTransferToAddresses] = useState({});
  const [loadingOptimisticMiloogys, setLoadingOptimisticMiloogys] = useState(true);

  const priceToMint = useContractReader(readContracts, "Miloogys", "price");
  if (DEBUG) console.log("🤗 priceToMint:", priceToMint);

  const totalSupply = useContractReader(readContracts, "Miloogys", "totalSupply");
  if (DEBUG) console.log("🤗 totalSupply:", totalSupply);
  const miloogysLeft = 3728 - totalSupply;

  useEffect(() => {
    const updateBalances = async () => {
      if (DEBUG) console.log("Updating balances...");
      if (readContracts.Miloogys) {
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
      for (let tokenIndex = 0; tokenIndex < yourMiloogyBalance; tokenIndex++) {
        try {
          const tokenId = await readContracts.Miloogys.tokenOfOwnerByIndex(address, tokenIndex);
          if (DEBUG) console.log("Getting Miloogy tokenId: ", tokenId);
          const tokenURI = await readContracts.Miloogys.tokenURI(tokenId);
          if (DEBUG) console.log("tokenURI: ", tokenURI);
          const jsonManifestString = atob(tokenURI.substring(29));

          try {
            const jsonManifest = JSON.parse(jsonManifestString);
            loogieUpdate.push({ id: tokenId, uri: tokenURI, owner: address, ...jsonManifest });
            let approved = await readContracts.Miloogys.getApproved(tokenId);
            loogieApproved[tokenId] = approved;
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
    };
    updateYourCollectibles();
  }, [address, yourMiloogyBalance]);

  return (
    <>
      <div class="mascot">
        <div class="logo" style={{margin: 1}}>
          <a href="https://opensea.io/collection/miloogy">
            <img src="banner.png" style={{ maxWidth: 600, padding: 10}} />
          </a>
        </div>
      </div>
      <div style={{ maxWidth: 820, margin: "auto", marginTop: 32, paddingBottom: 32 }}>
        <div style={{ fontSize: 16 }}>
          <p>
            Only <strong>3728 Optimistic Miloogys</strong> available (2X the supply of the <a href="https://miloogys.io" target="_blank">Original Ethereum Mainnet Miloogys</a>) on a price curve <strong>increasing 0.2%</strong> with each new mint.
          </p>
          <p>All Ether from sales goes to public goods!!</p>
          <p>
            You can upgrade your <strong>Optimistic Miloogy</strong>, mint some accesories and add the accesories to your <strong>FancyMiloogy</strong>.
          </p>
        </div>
      </div>

      <div style={{margin: "auto", padding: 24}}>
      <audio controls autoplay loop>
        <source src="Lovage_Book_of_the_Month_Album_Version_.ogg" type="audio/ogg" />
        <source src="Lovage_Book_of_the_Month_Album_Version_.mp3" type="audio/mpeg" />
      </audio>
    </div>

      <div style={{ maxWidth: 515, margin: "0 auto", paddingBottom: 32 }}>
        <Button
          type="primary"
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
          MINT for Ξ{priceToMint && (+ethers.utils.formatEther(priceToMint)).toFixed(4)}
        </Button>
        <p style={{ fontWeight: "bold" }}>
          { miloogysLeft } left
        </p>
      </div>
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
                      {yourMiloogysApproved[id] != readContracts.Miloogys.address ? (
                        <Button
                          onClick={async () => {
                            tx(writeContracts.Miloogys.approve(readContracts.Miloogys.address, id)).then(
                              res => {
                                setYourMiloogysApproved(yourMiloogysApproved => ({
                                  ...yourMiloogysApproved,
                                  [id]: readContracts.Miloogys.address,
                                }));
                              },
                            );
                          }}
                        >
                          Approve upgrade to FancyMiloogy
                        </Button>
                      ) : (
                        <Button
                          onClick={async (event) => {
                            event.target.parentElement.disabled = true;
                            tx(writeContracts.Miloogys.mintItem(id), function (transaction) {
                              setUpdateBalances(updateBalances + 1);
                            });
                          }}
                        >
                          Upgrade to FancyMiloogy
                        </Button>
                      )}
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
