//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "hardhat/console.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

contract NCPProof is ERC721, Ownable  {
    using Counters for Counters.Counter;
    using Strings for uint256;

    Counters.Counter private _tokenIdCounter;
    Counters.Counter private _contentIdCounter;

    mapping(address => bool) private _contentServers;
    // nftId -> contentId
    mapping(uint256 => uint256) private _nftContentId;
    // contentId -> address
    mapping(uint256 => address) private _distributionOwner;

    string private _strBaseTokenURI;

    event MintNFT(address indexed _to, uint256 _contentId);

    constructor() ERC721("NFT Content Player Proof", "NCPP") {
        _strBaseTokenURI = "https://ipfs/";
    }

    function setBaseTokenURI(string memory baseURI) public onlyOwner {
        _strBaseTokenURI = baseURI;
    }
    // Set an address as a content server, aka, they can create signatures that allows
    // the calling of newContent()
    function setContentServer(address contentServer, bool set) public onlyOwner {
        _contentServers[contentServer] = set;
    }

    function newContentId() public onlyOwner returns(uint256) {
        uint256 contentId = _contentIdCounter.current();
        _contentIdCounter.increment();

        return contentId;
    }

    // Add content to owner
    function newContent(uint256 contentId, address contentOwner, bytes32 r, bytes32 s, uint8 v) public {
        // signature verify keccak256(abi.encodePacked(contentId, owner))
        require(_distributionOwner[contentId] == address(0), "Content already added");

        address signer = ecrecover(keccak256(abi.encodePacked(contentId, contentOwner)), v, r, s);

        require(_contentServers[signer], "Can't create content because you are not content server");

        _distributionOwner[contentId] = contentOwner;
    }

    function transferContentRights(uint256 contentId, address newOwner) public returns(bool) {
        uint256 total = countOfNFT();

        for (uint256 token = 0; token < total; token++) {
            if (ownerOf(token) == msg.sender && contentOf(token) == contentId) {
                _transfer(msg.sender, newOwner, token);
                return true;
            }
        }

        return false;
    }

    function mint(address to, uint256 contentId) public returns(uint256){
        require(contentDistributorOf(contentId) == msg.sender, "You can't mint this NFT");
        require(!hasNFTForContent(to, contentId), "NFT already minted");

        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();

        _mint(to, tokenId);

        emit MintNFT(to, contentId);

        return tokenId;
    }

    function hasNFTForContent(address owner, uint256 contentId) public view returns(bool) {
        uint256 total = countOfNFT();

        for (uint256 token = 0; token < total; token++) {
            if (ownerOf(token) == owner && contentOf(token) == contentId) {
                return true;
            }
        }

        return false;
    }

    function contentOf(uint256 tokenId) public view returns(uint256) {
        return _nftContentId[tokenId];
    }

    function contentDistributorOf(uint256 contentId) public view returns(address) {
        return _distributionOwner[contentId];
    }

    function _burn(uint256 tokenId) internal override {
        super._burn(tokenId);
    }

    function countOfNFT() public view returns (uint256) {
        return _tokenIdCounter.current();
    }

    function countOfContent() public view returns (uint256) {
        return _contentIdCounter.current();
    }

    function withdraw() public onlyOwner {
        payable(msg.sender).transfer(address(this).balance);
    }

    function _baseURI() internal view override returns (string memory) {
        return _strBaseTokenURI;
    }

    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        require(
            _exists(tokenId),
            "ERC721Metadata: URI query for nonexistent token"
        );

        string memory baseURI = _baseURI();
        return
            bytes(baseURI).length > 0
                ? string(abi.encodePacked(baseURI, contentOf(tokenId).toString(), ".json"))
                : "";
    }
}
