pragma solidity ^0.8.0;
//SPDX-License-Identifier: MIT

import "@openzeppelin/contracts/interfaces/IERC721Enumerable.sol";


interface IMiloogys is IERC721Enumerable{

  function race(uint) external view returns(bytes3);
  function eyeColor(uint) external view returns(bytes3);
  function bmi(uint) external view returns(uint);
  function nftContractsAvailables(address) external view returns(bool);
  function tokenURI(uint256) external view returns (string memory);
  function renderTokenById(uint256) external view returns (string memory);
  function nftContractsCount() external view returns (uint256);
  function getContractsAddress() external view returns (address[] memory);
  function hasNft(address, uint256) external view returns (bool);
  function nftId(address, uint256) external view returns (uint256);

}
