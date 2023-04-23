import React, { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button, Card, List, Spin } from "antd";
import { Address } from "../components";
import { ethers } from "ethers";
import { useContractReader } from "eth-hooks";

function FancyMiloogys({ }) {
 

  return (
    <>
      <div class="box" style={{maxWidth: 740, padding:0, margin:"auto", textAlign:"left"}}>
        <div class="box_bar">
          <h2 style={{color:"#2f4d0c"}}>&nbsp;Mint</h2>
        </div>
        <p style={{paddingLeft:10, paddingRight:10}}>
            Once the contract is live, Miloogys can be minted <a href="/Miloogy">here</a>.
          </p>
      </div>
      <div style={{ maxWidth: 820, margin: "auto", paddingTop: 24, paddingBottom: 12}}>
        <hr />
        <h2>Details:</h2>
        <div style={{ fontSize: 16, textAlign:"left"  }}>
          <ul>
            <li>Only <strong>1436 Miloogys</strong> available (ILY Milady / ILY Loogie)</li>
            <li><strong>656</strong> free mints for Milady, Loogie, Optimistic/Fancy Loogy holders (Loogie loves Milady / Milady love Loogie)</li>
            <li>15% Ether from sales goes to <a href="https://twitter.com/buidlguidl" target="_blank">buidlguidl.eth</a> for making <a href="https://github.com/scaffold-eth/scaffold-eth" target="_blank">scaffold-eth</a></li>
            <li>15% Ether from sales goes to <a href="https://twitter.com/optimizoor" target="_blank">vectorized.eth</a> for making <a href="https://github.com/Vectorized/solady/" target="_blank">solady</a></li>
            <li>
              After all the <strong>Miloogys</strong> sell, holders will be able to upgrade by minting hair, eyebrows, backgrounds and more.
            </li>
          </ul>
        </div>
        <hr />
      </div>

      <div class="box" style={{maxWidth: 740, padding:0, margin:"auto", textAlign:"left"}}>
        <div class="box_bar">
          <h2 style={{color:"#2f4d0c"}}>&nbsp;Viral Public</h2>
        </div>
        <p style={{paddingLeft:10, paddingRight:10}}>
            This project uses Milady Maker branding, and is therefore copylefted under the
            <a href="https://viralpubliclicense.org">Viral Public License</a>. You can fork
            the repo <a href="https://github.com/0xWildhare/miloogymaker">here</a>.
          </p>
      </div>
      
    </>
  );
}

export default FancyMiloogys;
