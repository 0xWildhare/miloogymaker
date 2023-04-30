//SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import './utils/Base64.sol';
import './utils/HexStrings.sol';
import './ToColor.sol';
//learn more: https://docs.openzeppelin.com/contracts/3.x/erc721

// GET LISTED ON OPENSEA: https://testnets.opensea.io/get-listed/step-two

contract Eyebrow is ERC721Enumerable {

  using Strings for uint256;
  using HexStrings for uint160;
  using ToColor for bytes3;
  using Counters for Counters.Counter;
  Counters.Counter private _tokenIds;

  address payable public constant recipient =
    payable(0x8faC8383Bb69A8Ca43461AB99aE26834fd6D8DeC);

  uint256 public constant limit = 1000;
  uint256 public constant curve = 1005; // price increase 0,5% with each purchase
  uint256 public price = 0.002 ether;

  // uint8 should be enough for length
  mapping (uint256 => uint256) public length;
  mapping (uint256 => bytes3) public color;
  mapping (uint256 => bytes3) public rareColor;

  constructor() ERC721("Miloogy Eyelash", "LOOGEL") {
    // RELEASE THE LOOGIE EYELASH!
  }

  function mintItem() public payable returns (uint256) {
      require(_tokenIds.current() < limit, "DONE MINTING");
      require(msg.value >= price, "NOT ENOUGH");

      price = (price * curve) / 1000;

      _tokenIds.increment();

      uint256 id = _tokenIds.current();
      _mint(msg.sender, id);

      bytes32 genes = keccak256(abi.encodePacked( id, blockhash(block.number-1), msg.sender, address(this) ));

      length[id] = 110+((10*uint256(uint8(genes[0])))/255);
      color[id] = bytes2(genes[0]) | ( bytes2(genes[1]) >> 8 ) | ( bytes3(genes[2]) >> 16 );

      if (uint8(genes[3]) > 200) {
        rareColor[id] = bytes2(genes[4]) | ( bytes2(genes[5]) >> 8 ) | ( bytes3(genes[6]) >> 16 );
      } else {
        rareColor[id] = color[id];
      }

      (bool success, ) = recipient.call{value: msg.value}("");
      require(success, "could not send");

      return id;
  }

  function tokenURI(uint256 id) public view override returns (string memory) {
      require(_exists(id), "not exist");
      string memory traits = getTraits(id);

      return
          string(
              abi.encodePacked(
                'data:application/json;base64,',
                Base64.encode(
                    bytes(
                          abi.encodePacked(
                              '{"name":"',
                              'Miloogy Eyelash #',id.toString(),
                              '", "description":"',
                              'This Miloogy Eyelash has length ',length[id].toString(),', color #',color[id].toColor(),' and middle eyelash color #',rareColor[id].toColor(),'!!!',
                              '", "external_url":"https://www.fancymiloogys.com/eyelash/',
                              id.toString(),
                              '", "attributes": [',
                              traits,
                              '], "owner":"',
                              (uint160(ownerOf(id))).toHexString(20),
                              '", "image": "',
                              'data:image/svg+xml;base64,',
                              Base64.encode(bytes(generateSVGofTokenById(id))),
                              '"}'
                          )
                        )
                    )
              )
          );
  }

  function generateSVGofTokenById(uint256 id) internal view returns (string memory) {

    return string(abi.encodePacked(
      '<svg width="400" height="400" xmlns="http://www.w3.org/2000/svg">',
        renderTokenById(id),
      '</svg>'
    ));
  }

  function renderTokenByIdBack(uint256 id) public view returns (string memory) {
    uint256[4] memory lengths = [length[id], length[id]-3, length[id]-4, length[id]-3];

    return "";
  }

  function renderTokenByIdFront(uint256 id) public view returns (string memory) {
    uint256[4] memory lengths = [length[id]+12, length[id]+10, length[id]+11, length[id]+13];

    return string(abi.encodePacked(
        '<path d="m149.16432,208.99725l2.83467,-7.4986c3.38887,-3.77775 6.94439,-7.22217 10.83326,-9.33327l16.33322,-8.33328c3.55553,-1.49999 5.94441,-1.99998 10.6666,-2.49998l8.83327,0c2.88888,0.6111 5.11108,0.88888 7.16662,1.83332" stroke-width="5" stroke="#000" fill="none"/>',
        '<path d="m254.49695,178.49745l4.83465,-4.49862c1.66666,-1.38888 3.33331,-2.11109 4.99997,-2.66664l10.6666,-1.16666c4.11108,0 8.22217,0.49999 12.33325,1.99998c1.44444,0.88889 3.38886,1.77777 3.8333,3.66665l2.33332,7.66661" stroke-width="5" stroke="#000" fill="none"/>'
    ));
  }

  function getTraits(uint id) public view returns(string memory) {
    return string(abi.encodePacked(
      '{"trait_type": "length", "value": "',
      length[id].toString(),
      '"},{"trait_type": "color", "value": "#',
      color[id].toColor(),
      '"},{"trait_type": "middleRareColor", "value": "#',
      rareColor[id].toColor(),
      '"}'
      ));
  }

  // Visibility is `public` to enable it being called by other contracts for composition.
  function renderTokenById(uint256 id) public view returns (string memory) {
    return string(abi.encodePacked(
      
        renderTokenByIdBack(id),
        renderTokenByIdFront(id)
      
      ));
  }
}
