//SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

//import "hardhat/console.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import './utils/Base64.sol';
import './utils/HexStrings.sol';
import './ToColor.sol';

interface NFTContract {
  function renderTokenByIdBack(uint256 id) external view returns (string memory);
  function renderTokenByIdFront(uint256 id) external view returns (string memory);
  function renderTokenById(uint256 id) external view returns (string memory);
  //function transferFrom(address from, address to, uint256 id) external virtual;
  function getTraits(uint256 id) external view returns(string memory);
  function tokenURI(uint256 id) external view returns (string memory); 
}

contract Bg is NFTContract {

    function renderTokenByIdBack(uint id) public view override returns(string memory) {
        return "";
    }

    function renderTokenByIdFront(uint id) public view override returns(string memory) {
        return "";
    }

    function renderTokenById(uint id) public view override returns(string memory) {
        return string(abi.encodePacked(
        renderTokenByIdBack(id),
        renderTokenByIdFront(id)
      ));
    }

    function getTraits(uint id) public view override returns(string memory) {
        return "";
    }

    function tokenURI(uint id) public view override returns(string memory) {
        return "";
    }

}