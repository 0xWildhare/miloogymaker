import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Alert, Button, Card, Col, Input, List, Menu, Row, Tabs, Dropdown, Badge } from "antd";
import { DownOutlined } from "@ant-design/icons";
import { Address, AddressInput } from "../components";
import { ethers } from "ethers";
const { TabPane } = Tabs;

function FancyMiloogyPreview({
  DEBUG,
  readContracts,
  writeContracts,
  tx,
  address,
  updateBalances,
  setUpdateBalances,
  nfts,
  nftsSvg,
  fancyMiloogysNfts,
  selectedFancyMiloogy,
  selectedFancyMiloogyPreview,
  setSelectedFancyMiloogyPreview,
  selectedNfts,
  setSelectedNfts,
  setFancyMiloogysNfts,
  fancyMiloogyPreviewActiveTab,
  setFancyMiloogyPreviewActiveTab,
}) {
  useEffect(() => {
    const updatePreview = async () => {
      if (DEBUG) console.log("Updating preview...");
      if (selectedFancyMiloogy) {
        let nftUpdate = {};
        const loogieSvg = await readContracts.Miloogys.renderTokenById(selectedFancyMiloogy);
        let nftsSvg = "";
        for (const nft of nfts) {
          if (selectedNfts[nft]) {
            nftsSvg += await readContracts[nft].renderTokenById(selectedNfts[nft]);
          }
          const svg =
            '<svg width="400" height="400" xmlns="http://www.w3.org/2000/svg">' + loogieSvg + nftsSvg + "</svg>";
          setSelectedFancyMiloogyPreview(svg);
        }
      } else {
        setSelectedFancyMiloogyPreview("");
      }
    };
    updatePreview();
  }, [address, selectedFancyMiloogy, selectedNfts, updateBalances]);

  return (
    <>
      {selectedFancyMiloogyPreview ? (
        <div class="fancy-loogie-preview">
          <Card
            style={{ width: 515 }}
            title={
              <div style={{ height: 45 }}>
                <span style={{ fontSize: 18, marginRight: 8 }}>Selected FancyMiloogy #{selectedFancyMiloogy}</span>
              </div>
            }
          >
            <div dangerouslySetInnerHTML={{ __html: selectedFancyMiloogyPreview }}></div>
            <Tabs
              activeKey={fancyMiloogyPreviewActiveTab}
              onChange={tab => setFancyMiloogyPreviewActiveTab(tab)}
              type="card"
            >
              {nfts.map(function (nft) {
                return (
                  <TabPane tab={
                    <div>
                      <svg width="40" height="40" xmlns="http://www.w3.org/2000/svg" style={{ float: "left" }}>
                        { nftsSvg[nft] }
                      </svg>
                    </div>
                    }
                    key={"preview-" + nft}
                  >
                    { fancyMiloogysNfts &&
                      fancyMiloogysNfts[selectedFancyMiloogy] &&
                      fancyMiloogysNfts[selectedFancyMiloogy][readContracts[nft].address] > 0 ? (
                        <div>
                          Wearing {nft} #{fancyMiloogysNfts[selectedFancyMiloogy][readContracts[nft].address]}
                          <Button
                            className="action-inline-button"
                            onClick={() => {
                              tx(writeContracts.Miloogys.removeNftFromMiloogy(readContracts[nft].address, selectedFancyMiloogy), function (transaction) {
                                setFancyMiloogysNfts(prevState => ({
                                  ...prevState,
                                  [selectedFancyMiloogy]: {
                                    ...prevState[selectedFancyMiloogy],
                                    [readContracts[nft].address]: 0
                                  }
                                }));
                                setUpdateBalances(updateBalances + 1);
                              });
                            }}
                          >
                            Remove {nft}
                          </Button>
                        </div>
                      ) : (
                        <div>
                          {selectedNfts[nft] ? (
                            <div>
                              <span>Previewing #{selectedNfts[nft]}</span>
                              { fancyMiloogysNfts &&
                                fancyMiloogysNfts[selectedFancyMiloogy] &&
                                fancyMiloogysNfts[selectedFancyMiloogy][readContracts[nft].address] == 0 && (
                                
                                <Button
                                  type="primary"
                                  className="action-inline-button"
                                  onClick={() => {
                                    const tankIdInBytes =
                                      "0x" + parseInt(selectedFancyMiloogy).toString(16).padStart(64, "0");

                                    tx(
                                      writeContracts[nft]["safeTransferFrom(address,address,uint256,bytes)"](
                                        address,
                                        readContracts.Miloogys.address,
                                        selectedNfts[nft],
                                        tankIdInBytes,
                                      ),
                                      function (transaction) {
                                        setSelectedNfts(prevState => ({
                                          ...prevState,
                                          [nft]: null,
                                        }));
                                        setFancyMiloogysNfts(prevState => ({
                                          ...prevState,
                                          [selectedFancyMiloogy]: {
                                            ...prevState[selectedFancyMiloogy],
                                            [readContracts[nft].address]: selectedNfts[nft]
                                          }
                                        }));
                                        setUpdateBalances(updateBalances + 1);
                                      },
                                    );
                                  }}
                                >
                                  Transfer
                                </Button>
                              )}
                            </div>
                          ) : (
                            <span>Select a {nft} to preview</span>
                          )}
                        </div>
                      )
                    }
                  </TabPane>
                )
              })}
            </Tabs>
          </Card>
        </div>
      ) : (
        <div class="fancy-loogie-preview">
          <Card
            style={{ width: 515 }}
            title={
              <div style={{ height: 45 }}>
                <span style={{ fontSize: 18, marginRight: 8 }}>No Miloogy selected</span>
              </div>
            }
          >
            <svg width="400" height="400" xmlns="http://www.w3.org/2000/svg">
              <g id="headline" fill="#fff" stroke="#000" strokeWidth="2">
                <ellipse cx="222" cy="144"  rx="89" ry="90"/>
                <ellipse cx="155" cy="202"  rx="75" ry="14" transform="rotate(22,155,202)"/>
                <ellipse cx="159" cy="165"  rx="75" ry="22" transform="rotate(-7,159,165)"/>
              </g>
              <g id="headfill" fill="#fff" >
                <ellipse cx="222" cy="144"  rx="89" ry="90" />
                <ellipse cx="155" cy="202"  rx="75" ry="14" transform="rotate(22,155,202)"/>
                <ellipse cx="159" cy="165"  rx="75" ry="22" transform="rotate(-7,159,165)"/>
              </g>
              
              <g id="eyes" transform="translate(65,270) scale(0.1,-0.1)" fill="#000000" >
                <path d="M1978 1449 c-27 -17 -48 -38 -48 -45 0 -19 15 -18 48 4 25 16 24 13 -9 -28 -53 -66 -60 -82 -65 -173 -7 -116 9 -173 61 -209 43 -29 159 -78 188 -78 9 0 17 7 17 15 0 8 -7 15 -16 15 -9 0 -14 3 -12 8 2 4 15 30 29 57 27 51 43 109 55 200 4 28 9 44 11 38 3 -7 12 -13 20 -13 19 0 12 34 -25 110 -14 30 -25 65 -24 77 4 32 -43 53 -120 53 -54 0 -70 -5 -110 -31z m88 -94 c10 -16 14 -34 10 -50 -15 -60 -73 -30 -60 30 11 54 24 59 50 20z m-109 -192 c-3 -10 -5 -4 -5 12 0 17 2 24 5 18 2 -7 2 -21 0 -30z m43 -106 c0 -5 -7 -4 -15 3 -8 7 -15 20 -15 29 1 13 3 13 15 -3 8 -11 15 -24 15 -29z m150 -3 c0 -8 -4 -14 -9 -14 -11 0 -22 26 -14 34 9 9 23 -3 23 -20z m-67 -45 c-6 -6 -17 -8 -24 -3 -9 5 -8 9 7 14 23 9 31 3 17 -11z"/><path d="M1214 1356 c-71 -16 -131 -45 -158 -75 -19 -21 -19 -21 0 -21 11 0 30 7 42 16 45 31 134 54 213 54 72 0 104 10 79 25 -22 14 -118 14 -176 1z"/><path d="M1129 1280 c-48 -25 -146 -115 -164 -150 -20 -39 -30 -106 -16 -114 6 -4 16 8 25 27 21 52 32 52 45 1 23 -91 57 -142 123 -187 35 -23 36 -25 16 -30 -21 -6 -21 -7 -3 -27 23 -25 50 -25 128 1 74 25 118 64 148 133 18 43 21 63 16 131 -3 44 -12 96 -20 115 -16 37 -67 90 -104 109 -36 18 -153 13 -194 -9z m69 -72 c-3 -26 -42 -36 -68 -18 -13 9 -12 12 4 25 11 8 31 15 44 15 19 0 23 -5 20 -22z m-45 -241 c15 -18 39 -31 75 -39 38 -10 52 -17 52 -30 0 -33 -58 -22 -115 21 -57 43 -94 107 -103 176 -4 38 -3 37 32 -30 20 -39 47 -83 59 -98z m214 -17 c2 -8 -2 -22 -7 -30 -9 -13 -11 -13 -20 0 -16 25 -12 52 7 48 10 -2 19 -10 20 -18z"/>
              </g>
            </svg>
            <div style={{ height: 90 }}>
              Select a Miloogy from the <a href="/Miloogy">Miloogy</a> Tab to wear.
            </div>
          </Card>
        </div>
      )}
    </>
  );
}

export default FancyMiloogyPreview;
