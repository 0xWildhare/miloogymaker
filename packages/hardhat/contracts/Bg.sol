//SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

//import "hardhat/console.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import './utils/Base64.sol';
import './utils/HexStrings.sol';
import './ToColor.sol';
import './interfaces/INftMetadata.sol';
import './interfaces/IMiloogys.sol';
import './interfaces/IAccessory.sol';


contract Bg is INftMetadata {

    using Strings for uint256;
    using HexStrings for uint160;
    using ToColor for bytes3;

    IMiloogys miloogys;
    IAccessory background;

    constructor(IMiloogys miloogys_, IAccessory background_) {
        miloogys = miloogys_;
        background = background_;
    }

    function renderTokenByIdBack(uint id) public view override returns(string memory) {
        //if you are reading this I promise this won't be what it actually looks like in production, I am just testing!
        string memory color = getColor(id);
        string memory render = string(abi.encodePacked(
            '<g class="background" >',
                '<rect fill="#',
                color,
                '" x="-1.2495" y="-2.99957" width="403.12397" height="292.49937" />',
                '<path fill="#CBFFFF" d="m80.70573,53.96501l-28.7063,13.49248c0.00672,0.00738 2.0567,18.00711 2.04998,17.99982c0.00672,0.00738 16.40645,1.13232 16.39981,1.12494c0.00672,0.00738 13.33153,0.00738 13.3248,0c0.00672,0.00738 16.40645,7.88225 16.39981,7.87487c0.00672,0.00738 25.63138,-8.99253 25.62466,-8.99991c0.00672,0.00738 25.63138,-1.11765 25.62466,-1.12494c0.00672,0.00738 13.33153,-21.36745 13.3248,-21.37474c0.00672,0.00738 -14.34311,-12.36754 -14.34983,-12.37483c0.00672,0.00738 -42.01774,-2.2426 -42.02446,-2.24998"/>',
                '<path fill="#CBFFFF" d="m221.78798,120.44581l41.13254,-19.15541l40.13577,0l35.11876,10.44533l22.07467,2.6113l11.0373,23.50196l-28.09504,8.70444l-66.22393,2.6113l-23.07803,-10.44533l-42.14255,-2.6113" />',
                '<path fill="#ffffff" d="m99.72496,53.08348l-37.89233,14.23899c0.00731,0.01169 3.35007,10.69969 3.34276,10.68801c0.00731,0.01169 26.74965,5.35562 26.74243,5.34393c0.00731,0.01169 14.49275,-7.11365 14.48544,-7.12534c0.00731,0.01169 1.12153,17.82503 17.83551,7.13702c16.71398,-10.68801 40.11365,-14.25068 26.74243,-26.71995l-25.63543,-1.79295" />',
                '<path fill="#ffffff" d="m233.62297,125.95281c10.60362,-6.37415 6.36217,-19.12251 32.87117,-17.30132l26.50213,1.81522l41.35406,10.92717c0.00696,0.00597 21.2141,-11.83183 20.15379,0.91653l-1.06728,12.74239l-48.77664,8.19534l-53.018,-10.01654" />',
                '<path fill="#894F3F"  d="m-1.87059,271.24999l115.09964,7.56846l105.69873,4.23894l88.88305,-0.84777l92.48642,5.93455l1.20109,107.66959l-1.20109,5.93455l-402.359,0.15223l0.19115,-130.65053z" />',
                '<path transform="rotate(3.02109 32.4992 267.064)"  d="m-8.00227,274.06446l40.50142,-14.00049l40.50142,14.00049l-81.00285,0z"  fill="#332D40"/>',
                '<path transform="rotate(3.07186 108.267 271.519)"  d="m49.26492,279.01959l59.00197,-15.00051l59.00197,15.00051l-118.00393,0z"  fill="#332D40"/>',
                '<path transform="rotate(1.70055 189.685 276.025)"  d="m134.18272,282.02474l55.50194,-12.00041l55.50194,12.00041l-111.00389,0z"  fill="#462735"/>',
                '<path  d="m233.57626,283.04478l15.00052,-7.00023l15.00052,7.00023l-30.00103,0z"  fill="#462735"/>',
                '<path transform="rotate(3.96457 367.816 282.756)"  d="m341.31507,286.75622l26.50094,-8.00028l26.50094,8.00028l-53.00189,0z"  fill="#462735"/>',
                '<path  d="m257.40207,282.86108l32.50114,-10.00034l32.50114,10.00034l-65.00228,0z"  fill="#462735"/>',
            '</g>'
        ));
        return render;
    }

    function renderTokenByIdFront(uint) public pure override returns(string memory) {
        return "";
    }

    function renderTokenById(uint id) public view override returns(string memory) {
        return string(abi.encodePacked(
        renderTokenByIdBack(id),
        renderTokenByIdFront(id)
      ));
    }

    function getTraits(uint id) public view override returns(string memory) {
        string memory color = getColor(id);
        return string(abi.encodePacked(
      '{"trait_type": "background", "value": "test only"},',
      '{"trait_type": "bg color", "value": "#',
      color,
      '"}'
      ));
    }

    function getColor(uint id) public view returns(string memory) {
        bytes32 predictableRandom = background.genes(id);
        bytes3 rawColor =  bytes2(predictableRandom[3]) | ( bytes2(predictableRandom[4]) >> 8 ) | ( bytes3(predictableRandom[5]) >> 16 );
        return rawColor.toColor();
    }

    function tokenURI(uint id) public view override returns(string memory) {
        string memory name = string(abi.encodePacked('Miloogy Background #',id.toString()));
      string memory description = "basic miloogy background for OGs only";
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
                            '", "external_url":"https://www.miloogymaker.net/background/',
                            id.toString(),
                            '", "attributes": [',
                            traits,
                            '], "owner":"',
                            (uint160(background.ownerOf(id))).toHexString(20),
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