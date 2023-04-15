pragma solidity >=0.8.0 <0.9.0;
//SPDX-License-Identifier: MIT

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import 'base64-sol/base64.sol';
import './HexStrings.sol';

abstract contract MiloogysContract {
  function renderTokenById(uint256 id) external virtual view returns (string memory);
  function transferFrom(
        address from,
        address to,
        uint256 tokenId
    ) external virtual;
}

abstract contract NFTContract {
  function renderTokenById(uint256 id) external virtual view returns (string memory);
  function transferFrom(address from, address to, uint256 id) external virtual;
}

contract FancyMiloogy is ERC721Enumerable, IERC721Receiver, Ownable {

  using Strings for uint256;
  using Strings for uint8;
  using HexStrings for uint160;
  using Counters for Counters.Counter;

  Counters.Counter private _tokenIds;

  MiloogysContract miloogys;
  mapping(uint256 => uint256) miloogyById;

  NFTContract[] public nftContracts;
  mapping(address => bool) nftContractsAvailables;
  mapping(address => mapping(uint256 => uint256)) nftById;

  constructor(address _miloogys) ERC721("FancyMiloogy", "FLOOG") {
    miloogys = MiloogysContract(_miloogys);
  }

  function addNft(address nft) public onlyOwner {
    nftContractsAvailables[nft] = true;
    nftContracts.push(NFTContract(nft));
  }

  function nftContractsCount() public view returns (uint256) {
    return nftContracts.length;
  }

  function getContractsAddress() public view returns (address[] memory) {
    address[] memory addresses = new address[](nftContracts.length);
    for (uint i=0; i<nftContracts.length; i++) {
      addresses[i] = address(nftContracts[i]);
    }
    return addresses;
  }

  function mintItem(uint256 miloogyId) public returns (uint256) {
      _tokenIds.increment();

      uint256 id = _tokenIds.current();
      _mint(msg.sender, id);

      miloogys.transferFrom(msg.sender, address(this), miloogyId);

      miloogyById[id] = miloogyId;

      return id;
  }

  function tokenURI(uint256 id) public view override returns (string memory) {
      require(_exists(id), "not exist");
      string memory name = string(abi.encodePacked('FancyMiloogy #',id.toString()));
      string memory description = string(abi.encodePacked('FancyMiloogy'));
      string memory image = Base64.encode(bytes(_generateSVGofTokenById(id)));

      return string(abi.encodePacked(
        'data:application/json;base64,',
        Base64.encode(
            bytes(
                abi.encodePacked(
                    '{"name":"',
                    name,
                    '", "description":"',
                    description,
                    '", "external_url":"https://www.fancymiloogys.com/fancymiloogy/',
                    id.toString(),
                    '", "owner":"',
                    (uint160(ownerOf(id))).toHexString(20),
                    '", "image": "',
                    'data:image/svg+xml;base64,',
                    image,
                    '"}'
                )
            )
        )
      ));
  }

  function _generateSVGofTokenById(uint256 id) internal view returns (string memory) {

    string memory svg = string(abi.encodePacked(
      '<svg width="400" height="400" xmlns="http://www.w3.org/2000/svg">',
        renderTokenById(id),
      '</svg>'
    ));

    return svg;
  }

  // Visibility is `public` to enable it being called by other contracts for composition.
  function renderTokenById(uint256 id) public view returns (string memory) {
    string memory render;

    render = string(abi.encodePacked(render, miloogys.renderTokenById(miloogyById[id])));

    for (uint i=0; i<nftContracts.length; i++) {
      if (nftById[address(nftContracts[i])][id] > 0) {
        render = string(abi.encodePacked(render, nftContracts[i].renderTokenById(nftById[address(nftContracts[i])][id])));
      }
    }

    return render;
  }

  // https://github.com/GNSPS/solidity-bytes-utils/blob/master/contracts/BytesLib.sol#L374
  function _toUint256(bytes memory _bytes) internal pure returns (uint256) {
        require(_bytes.length >= 32, "toUint256_outOfBounds");
        uint256 tempUint;

        assembly {
            tempUint := mload(add(_bytes, 0x20))
        }

        return tempUint;
  }

  function removeNftFromMiloogy(address nft, uint256 id) external {
    require(msg.sender == ownerOf(id), "only the owner can undress a miloogy!!");
    require(this.hasNft(nft, id), "the miloogy is not wearing this NFT");

    NFTContract nftContract = NFTContract(nft);
    _removeNftFromMiloogy(nftContract, id);
  }

  function downgradeMiloogy(uint256 id) external {
    require(msg.sender == ownerOf(id), "only the owner can downgrade a miloogy!!");

    // remove nft tokens from FancyMiloogy
    for (uint i=0; i<nftContracts.length; i++) {
      if (nftById[address(nftContracts[i])][id] > 0) {
        _removeNftFromMiloogy(nftContracts[i], id);
      }
    }

    // transfer miloogy to owner
    miloogys.transferFrom(address(this), ownerOf(id), miloogyById[id]);
    miloogyById[id] = 0;

    // burn FancyMiloogy
    _burn(id);
  }

  function _removeNftFromMiloogy(NFTContract nftContract, uint256 id) internal {
    nftContract.transferFrom(address(this), ownerOf(id), nftById[address(nftContract)][id]);

    nftById[address(nftContract)][id] = 0;
  }

  function hasNft(address nft, uint256 id) external view returns (bool) {
    require(nftContractsAvailables[nft], "the miloogys can't wear this NFT");

    return (nftById[nft][id] != 0);
  }

  function nftId(address nft, uint256 id) external view returns (uint256) {
    require(nftContractsAvailables[nft], "the miloogys can't wear this NFT");

    return nftById[nft][id];
  }

  // to receive ERC721 tokens
  function onERC721Received(
      address /*operator*/,
      address from,
      uint256 tokenId,
      bytes calldata fancyIdData) external override returns (bytes4) {

      uint256 fancyId = _toUint256(fancyIdData);

      require(ownerOf(fancyId) == from, "you can only add stuff to a fancy miloogy you own.");
      require(nftContractsAvailables[msg.sender], "the miloogys can't wear this NFT");
      require(nftById[msg.sender][fancyId] == 0, "the miloogy already has this NFT!");

      nftById[msg.sender][fancyId] = tokenId;

      return this.onERC721Received.selector;
    }
}
