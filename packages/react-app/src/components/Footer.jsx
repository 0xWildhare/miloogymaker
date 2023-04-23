import Address from "./Address";
import React from "react";

// displays a page footer

export default function Footer({ mainnetProvider }) {
  return (
    <div class="footer">
      <p>
        <span>🛠 Created by</span>
        <span class="address">
          <Address value={"0xWildhare.eth"} ensProvider={mainnetProvider} fontSize={18} />
        </span>
        <span>with</span>
        <a href="https://github.com/scaffold-eth/scaffold-eth" target="_blank" rel="noopener noreferrer">
          🏗 scaffold-eth
        </a>
        <span>and</span>
        <a href="https://github.com/Vectorized/solady/" target="_blank" rel="noopener noreferrer">
          solady
        </a>
      </p>
    </div>
  );
}
