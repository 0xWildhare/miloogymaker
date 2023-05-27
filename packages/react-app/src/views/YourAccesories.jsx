import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button, Card, List } from "antd";
import { Address, AddressInput } from "../components";
import { ethers } from "ethers";
import { useContractReader } from "eth-hooks";

function YourAccesories({
  DEBUG,
  readContracts,
  writeContracts,
  tx,
  mainnetProvider,
  blockExplorer,
  address,
  updateBalances,
  setUpdateBalances,
  nft,
  fancyMiloogysNfts,
  selectedFancyMiloogy,
  selectedNfts,
  setSelectedNfts,
  setFancyMiloogyPreviewActiveTab,
}) {
  const [nftBalance, setNftBalance] = useState(0);
  const [yourNftBalance, setYourNftBalance] = useState(0);
  const [yourNfts, setYourNfts] = useState();
  const [transferToAddresses, setTransferToAddresses] = useState({});
  const [updateNftBalance, setUpdateNftBalance] = useState(0);
  const [loadingNfts, setLoadingNfts] = useState(true);

  const nftsText = {
    Hair: '<p>Only <strong>1000 Hairs</strong> available on a price curve <strong>increasing 0.5%</strong> with each new mint.</p><p>Each Hair has some <strong>random properties</strong></p>',
    Eyebrows: '<p>Only <strong>1000 Eyebrows</strong> available on a price curve <strong>increasing 0.5%</strong> with each new mint.</p><p>Each set of Eyebrows has some <strong>random properties</strong></p>',
    Background: '<p>Only <strong>1000 Backgrounds</strong> available on a price curve <strong>increasing 0.5%</strong> with each new mint.</p><p>Each Background has some <strong>random properties</strong> and, if you are lucky, you can get a <strong>crazy one</strong>!</p>',
    Shirt: '<p>Only <strong>1000 Shirts</strong> available on a price curve <strong>increasing 0.5%</strong> with each new mint.</p><p>The Shirts have some <strong>random properties</strong> and include the body (neck and arms)</p>',
  };

  const priceToMint = useContractReader(readContracts, nft, "price");
  if (DEBUG) console.log("🤗 priceToMint:", priceToMint);

  const totalSupply = useContractReader(readContracts, nft, "totalSupply");
  if (DEBUG) console.log("🤗 totalSupply:", totalSupply);
  const nftLeft = 1000;// - totalSupply;

  useEffect(() => {
    const updateBalances = async () => {
      if (DEBUG) console.log("Updating balances...");
      if (readContracts[nft]) {
        const nftNewBalance = await readContracts[nft].balanceOf(address);
        const yourNftNewBalance = nftNewBalance && nftNewBalance.toNumber && nftNewBalance.toNumber();
        if (DEBUG) console.log("NFT: ", nft, " - Balance: ", nftNewBalance, " - Your: ", yourNftNewBalance);
        setNftBalance(nftNewBalance);
        setYourNftBalance(yourNftNewBalance);
      } else {
        if (DEBUG) console.log("Contracts not defined yet.");
      }
    };
    updateBalances();
  }, [address, readContracts[nft], updateNftBalance]);

  useEffect(() => {
    const updateYourCollectibles = async () => {
      const nftUpdate = [];

      setLoadingNfts(true);

      for (let tokenIndex = 0; tokenIndex < yourNftBalance; tokenIndex++) {
        try {
          const tokenId = await readContracts[nft].tokenOfOwnerByIndex(address, tokenIndex);
          if (DEBUG) console.log("Getting ", nft, " tokenId: ", tokenId);
          const tokenURI = await readContracts[nft].tokenURI(tokenId);
          if (DEBUG) console.log("tokenURI: ", tokenURI);
          const jsonManifestString = atob(tokenURI.substring(29));

          try {
            if (DEBUG) console.log("JSON: ", jsonManifestString);
            const jsonManifest = JSON.parse(jsonManifestString);
            nftUpdate.unshift({ id: tokenId, uri: tokenURI, owner: address, ...jsonManifest });
          } catch (e) {
            console.log(e);
          }
        } catch (e) {
          console.log(e);
        }
      }

      setYourNfts(nftUpdate);

      setLoadingNfts(false);
    };
    updateYourCollectibles();
  }, [address, yourNftBalance]);

  console.log("fancyMiloogysNfts", fancyMiloogysNfts);

  return (
    <>
      <div style={{ width: 515, marginTop: 32, paddingBottom: 32 }}>
        <div dangerouslySetInnerHTML={{ __html: nftsText[nft] }}></div>
        
        {nft == "Background" ?
          <Button
            type="primary"
            onClick={async () => {
              console.log("nft", nft);
              try {
                tx(writeContracts[nft].mintBasicBg(), function (transaction) {
                  setUpdateNftBalance(updateNftBalance + 1);
                });
              } catch (e) {
                console.log("mint failed", e);
              }
            }}
          >
            MINT OG BG for FREE
          </Button>
          : 
          <Button
          type="primary"
          onClick={async () => {
            const priceRightNow = await readContracts[nft].price();
            try {
              tx(writeContracts[nft].mintItem({ value: priceRightNow, gasLimit: 300000 }), function (transaction) {
                setUpdateNftBalance(updateNftBalance + 1);
              });
            } catch (e) {
              console.log("mint failed", e);
            }
          }}
        >
          MINT for Ξ{priceToMint && (+ethers.utils.formatEther(priceToMint)).toFixed(4)}
        </Button>
        }
        <p style={{ fontWeight: "bold" }}>
          { nftLeft } left
        </p>
      </div>

      <div style={{ width: 515, paddingBottom: 256 }}>
        <List
          bordered
          loading={loadingNfts}
          dataSource={yourNfts}
          renderItem={item => {
            const id = item.id.toNumber();
            return (
              <List.Item key={id + "_" + item.uri + "_" + item.owner}>
                <Card
                  title={
                    <div>
                      <div style={{ height: 45 }}>
                        <span style={{ fontSize: 18, marginRight: 8 }}>{item.name}</span>
                        { fancyMiloogysNfts &&
                          fancyMiloogysNfts[selectedFancyMiloogy] &&
                          fancyMiloogysNfts[selectedFancyMiloogy][readContracts[nft].address] == 0 && (
                          <Button
                            style={{ marginRight: 10 }}
                            disabled={ selectedNfts[nft] == id }
                            onClick={() => {
                              setSelectedNfts(prevState => ({
                                ...prevState,
                                [nft]: id,
                              }));
                              setFancyMiloogyPreviewActiveTab("preview-"+nft);
                            }}
                          >
                            { selectedNfts[nft] == id ? "Previewing" : "Preview" }
                          </Button>
                        )}
                      </div>
                    </div>
                  }
                >
                  <div class="nft-image">
                    <img src={item.image} />
                  </div>
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
                      type="primary"
                      style={{ marginTop: 10 }}
                      onClick={() => {
                        tx(writeContracts[nft].transferFrom(address, transferToAddresses[id], id), function (transaction) {
                          setUpdateNftBalance(updateNftBalance + 1);
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

export default YourAccesories;
