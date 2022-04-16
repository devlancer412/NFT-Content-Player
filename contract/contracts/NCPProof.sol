//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "hardhat/console.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

contract NCPProof is ERC721, Ownable {
    using Counters for Counters.Counter;
    using Strings for uint256;

    Counters.Counter private _tokenIdCounter;

    string private _strBaseTokenURI;

    event MintNFT(address indexed _to, uint256 _number);

    constructor() ERC721("NFT Content Player Proof", "NCPP") {
        _strBaseTokenURI = "https://gateway.pinata.cloud/ipfs/Qmdbpbpy7fA99UkgusTiLhMWzyd3aETeCFrz7NpYaNi6zY/";
    }

    function _baseURI() internal view override returns (string memory) {
        return _strBaseTokenURI;
    }

    function totalCount() public pure returns (uint256) {
        return 1000;
    }

    function price() public view returns (uint256) {
        return 5 * 10**16;
    }

    function safeMint(address to, uint256 number) public onlyOwner {
        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();
        _safeMint(to, tokenId);

        emit MintNFT(to, number);
        // _setTokenURI(tokenId, tokenURI(tokenId));
    }

    function _burn(uint256 _tokenId) internal override {
        super._burn(_tokenId);
    }

    function tokenURI(uint256 tokenId)
        public
        view
        override
        returns (string memory)
    {
        require(
            _exists(tokenId),
            "ERC721Metadata: URI query for nonexistent token"
        );

        string memory baseURI = _baseURI();
        return
            bytes(baseURI).length > 0
                ? string(abi.encodePacked(baseURI, tokenId.toString(), ".json"))
                : "";
    }

    function payToMint(address recipiant) public payable {
        require(_tokenIdCounter.current() <= totalCount(), "All NFT minted!");
        require(balanceOf(recipiant) == 0, "Already minted");
        require(msg.value >= price(), "Need to pay up!");

        uint256 newItemid = _tokenIdCounter.current();
        _tokenIdCounter.increment();

        _mint(recipiant, newItemid);

        emit MintNFT(recipiant, number);
    }

    function count() public view returns (uint256) {
        return _tokenIdCounter.current();
    }

    function withdraw() public onlyOwner {
        payable(msg.sender).transfer(address(this).balance);
    }

    function _leaf(address account) internal pure returns (bytes32) {
        return keccak256(abi.encodePacked(account));
    }
}
