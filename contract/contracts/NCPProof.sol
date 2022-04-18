//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "hardhat/console.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

contract NCPProof is ERC721URIStorage, Ownable  {
    using Counters for Counters.Counter;
    using Strings for uint256;

    Counters.Counter private _tokenIdCounter;

    event MintNFT(address indexed _to);

    constructor() ERC721("NFT Content Player Proof", "NCPP") {
    }

    function price() public pure returns (uint256) {
        return 5 * 10**16;
    }

    function safeMint(address to, string memory uri) public onlyOwner {
        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, uri);

        emit MintNFT(to);
        // _setTokenURI(tokenId, tokenURI(tokenId));
    }

    function _burn(uint256 _tokenId) internal override {
        super._burn(_tokenId);
    }

    function payToMint(address recipiant, string memory uri) public payable returns(uint256) {
        require(!hasNFT(recipiant, uri), "NFT already minted");
        require(msg.value >= price(), "Need to pay up!");

        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();

        _mint(recipiant, tokenId);
        _setTokenURI(tokenId, uri);

        emit MintNFT(recipiant);

        return tokenId;
    }

    function count() public view returns (uint256) {
        return _tokenIdCounter.current();
    }

    function withdraw() public onlyOwner {
        payable(msg.sender).transfer(address(this).balance);
    }

    function hasNFT(address owner, string memory uri) public view returns(bool) {
        uint totalSupply = _tokenIdCounter.current();

        for (uint i = 0; i < totalSupply; i++) {
            if (ownerOf(i) == owner && compareStrings(tokenURI(i), uri)) {
                return true;
            }
        }

        return false;
    }

    function compareStrings(string memory a, string memory b) public view returns (bool) {
        return (keccak256(abi.encodePacked((a))) == keccak256(abi.encodePacked((b))));
    }
}
