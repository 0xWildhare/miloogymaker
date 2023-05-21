//SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

//import "hardhat/console.sol";
//import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/interfaces/IERC721Enumerable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import './utils/Base64.sol';
import './utils/HexStrings.sol';
import './ToColor.sol';
import './interfaces/Inft.sol';



contract Eb is Inft {

    using Strings for uint256;
    using HexStrings for uint160;

    IERC721Enumerable eyebrows;

    constructor(IERC721Enumerable eyebrows_){
        eyebrows = eyebrows_;
    }

    function renderTokenByIdBack(uint id) public view override returns(string memory) {
        return "";
    }

    function renderTokenByIdFront(uint id) public view override returns(string memory) {
        return string(abi.encodePacked('<g class="eyebrows" transform="translate(100,42) scale(6 6)">',
            '<path d="m8.25,17.3125l0.4375,-1.25l3.5625,-2.5625l1.8125,-0.5625l1.3125,-0.25l2.125,0.1875" stroke="#000000" fill="none"/>',
            '<path d="m26.4375,12l1.125,-0.75l2.375,-0.375l2.375,0.4375l0.875,1.8125" opacity="NaN" stroke="#000000" fill="none"/>',
            '</g>'
        ));
    }

    function renderTokenById(uint id) public view override returns(string memory) {
        return string(abi.encodePacked(
        renderTokenByIdBack(id),
        renderTokenByIdFront(id)
      ));
    }

    function getTraits(uint id) public view override returns(string memory) {
        return string(abi.encodePacked(
      '{"trait_type": "eyebrows", "value": "OG"}'
      ));
    }

    function tokenURI(uint id) public view override returns(string memory) {
        
        string memory name = string(abi.encodePacked('Miloogy Eyebrows #',id.toString()));
        string memory description = "basic miloogy eyebrows";
        string memory image = Base64.encode(bytes(generateSVGofTokenById(id)));
        string memory traits;

        return
        string(
            abi.encodePacked(
                'data:application/json;base64,',
                Base64.encode(
                    bytes(
                        abi.encodePacked(
                            '{"name":"',
                            name,
                            '", "description":"',
                            description,
                            '", "external_url":"https://www.miloogymaker.net/eyebrows/',
                            id.toString(),
                            '", "attributes": [',
                            traits,
                            '], "owner":"',
                            (uint160(eyebrows.ownerOf(id))).toHexString(20),
                            '", "image": "',
                            'data:image/svg+xml;base64,',
                            image,
                            '"}'
                        )
                        )
                    )
            )
        );
    }

    function generateSVGofTokenById(uint256 id) internal view returns (string memory) {

        string memory svg = string(abi.encodePacked(
        '<svg width="400" height="400" xmlns="http://www.w3.org/2000/svg">',
            renderTokenById(id),
        '</svg>'
        ));

        return svg;
    }

}