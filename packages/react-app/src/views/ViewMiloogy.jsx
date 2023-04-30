
import React, { useEffect, useState, useRef } from "react";
import { useParams, Redirect, Link } from "react-router-dom";
import {  Address } from "../components";


const { ethers } = require("ethers");

function ViewMiloogy({ readContracts, blockExplorer, mainnetProvider, targetNetwork, totalSupply }) {
  let { id } = useParams();
  const fetchedId = useRef();

  //const rawTokenURI = useContractReader(readContracts, "Miloogys", "tokenURI", [id]);
  const [tokenURI, setTokenURI] = useState();
  useEffect(() => {
    const getTokenData = async () => {
        try{
            let rawTokenURI = await readContracts.Miloogys.tokenURI(id);
            

            if (rawTokenURI) {
                const STARTS_WITH = "data:application/json;base64,";
                let tokenURIJSON = JSON.parse(Buffer.from(rawTokenURI.slice(STARTS_WITH.length), 'base64'));
                setTokenURI(tokenURIJSON);
                fetchedId.current = id;
                console.log(tokenURIJSON);
            }
        } catch(e) {
            console.log(e);
        }
    };
    if (id && readContracts && id !== fetchedId.current) getTokenData();
  }, [id, readContracts]);

  const tokenView = tokenURI ? (
    <>
      <div>
        {id !== "1" && <Link to={`/token/${parseInt(id) - 1}`}>{"<"}</Link>}
        <span style={{ fontSize: 24, marginRight: 8 }}>{tokenURI.name}</span>
        {id !== totalSupply.toString() && <Link to={`/token/${parseInt(id) + 1}`}>{">"}</Link>}
      </div>
      <img src={tokenURI && tokenURI.image} height="200" alt="" />

      <div style={{ padding: 4 }}>
        <p>
          <span>Owner: </span>
          <Address address={tokenURI.owner} ensProvider={mainnetProvider} blockExplorer={blockExplorer} fontSize={16} />
        </p>
        <p>
          <a
            href={`https://${targetNetwork.name == "rinkeby" ? `testnets.` : ""}opensea.io/assets/${
              readContracts.Miloogys.address
            }/${id}`}
            target="_blank"
          >
            OpenSea
          </a>
          <span>{` / `}</span>
          <a href={`${blockExplorer}/token/${readContracts.Miloogys.address}?a=${id}`} target="_blank">
            Etherscan
          </a>
        </p>
        <p>{tokenURI.description}</p>
        {/*<p>{item.uri.attributes[0]["value"]}</p>*/}
        {/*<img src={url} height="200" alt="" />*/}
      </div>
    </>
  ) : (
    <span>loading...</span>
  );

  return (
    <div>{id && totalSupply && parseInt(id) > parseInt(totalSupply.toString()) ? <Redirect to="/" /> : tokenView}</div>
  );
}

export default ViewMiloogy;