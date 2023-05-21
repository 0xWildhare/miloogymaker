//SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

import "@openzeppelin/contracts/interfaces/IERC721Enumerable.sol";

interface IAccessory is IERC721Enumerable {
  function renderTokenByIdBack(uint256 id) external view returns (string memory);
  function renderTokenByIdFront(uint256 id) external view returns (string memory);
  function renderTokenById(uint256 id) external view returns (string memory);
  function getTraits(uint256 id) external view returns(string memory);
  function tokenURI(uint256 id) external view returns (string memory); 
  function genes(uint id) external view returns(bytes32);
}