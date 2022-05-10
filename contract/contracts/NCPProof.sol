//SPDX-License-Identifier: Unlicense
//
//
//  @Name       NFT-Content-Player-Proof contract
//  @Author     Joseph Anderson
//  @Type       ERC721
//  @Date       27/4/2022
//  @version    0.0.1

pragma solidity ^0.8.0;

import "hardhat/console.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";

contract NCPProof is ERC721, Ownable {
    using Counters for Counters.Counter;
    using Strings for uint256;
    using ECDSA for bytes32;

    Counters.Counter private _tokenIdCounter;

    mapping(address => bool) private _contentServers;
    // nftId -> contentId
    mapping(uint256 => uint256) private _nftContentId;
    // contentId -> address
    mapping(uint256 => address) private _distributionOwner;
    // contentId -> (address -> bool)
    mapping(uint256 => mapping(address => bool)) _distributors;
    // nftId -> period.
    mapping(uint256 => uint256) private _endTimes;

    string private _strBaseTokenURI;

    event MintNFT(address indexed _to, uint256 _contentId);

    constructor() ERC721("NFT Content Player Proof", "NCPP") {
        _strBaseTokenURI = "https://ipfs/";
    }

    // set base uri for token. token uri = base/tokenId.json
    function setBaseTokenURI(string memory baseURI) public onlyOwner {
        _strBaseTokenURI = baseURI;
    }

    // Set an address as a content server, aka, they can create signatures that allows
    // the calling of newContent()
    function setContentServer(address contentServer, bool set)
        public
        onlyOwner
    {
        _contentServers[contentServer] = set;
    }

    // Return true if addr is content server.
    function isContentServer(address addr) public view returns (bool) {
        if (addr == owner()) {
            return true;
        }

        return _contentServers[addr];
    }

    // return true if contentId is already used.
    function isSetted(uint256 contentId) public view returns (bool) {
        return _distributionOwner[contentId] != address(0);
    }

    // get signer from sign tring and signature.
    function getSigner(bytes32 hash, bytes memory signature)
        internal
        pure
        returns (address)
    {
        bytes32 signedHash = keccak256(
            abi.encodePacked("\x19Ethereum Signed Message:\n32", hash)
        );
        return signedHash.recover(signature);
    }

    // Add content to owner
    function newContent(
        uint256 contentId,
        address contentOwner,
        bytes memory signature
    ) public returns (bool) {
        // signature verify keccak256(abi.encodePacked(contentId, owner))
        require(
            _distributionOwner[contentId] == address(0),
            "Content already added"
        );

        bytes32 msgHash = keccak256(abi.encodePacked(contentOwner, contentId));
        address signer = getSigner(msgHash, signature);

        require(
            isContentServer(signer),
            "Can't create content because you are not content server"
        );

        _distributionOwner[contentId] = contentOwner;
        _distributors[contentId][contentOwner] = true;

        return true;
    }

    // set addr to distributor of contentId
    function setDistributor(uint256 contentId, address addr) public {
        require(
            contentOwnerOf(contentId) == msg.sender,
            "You are not content owner"
        );
        require(!isContentDistributorOf(contentId, addr), "Already set");

        _distributors[contentId][addr] = true;
    }

    // remove addr from distributor of contentId
    function removeDistributor(uint256 contentId, address addr) public {
        require(
            contentOwnerOf(contentId) == msg.sender,
            "You are not content owner"
        );
        require(isContentDistributorOf(contentId, addr), "Already set");

        _distributors[contentId][addr] = false;
    }

    // // Transfer NFT for contentId to newOwner.
    // function transferNFTRights(uint256 contentId, address newOwner)
    //     public
    //     returns (bool)
    // {
    //     uint256 total = countOfNFT();

    //     for (uint256 token = 0; token < total; token++) {
    //         if (ownerOf(token) == msg.sender && contentOf(token) == contentId) {
    //             _transfer(msg.sender, newOwner, token);
    //             return true;
    //         }
    //     }

    //     return false;
    // }

    // transfer Ownership of contentId to newOwner.
    function transferContentRights(uint256 contentId, address newOwner) public {
        require(
            _distributionOwner[contentId] == msg.sender,
            "You are not owner of this content"
        );

        _distributionOwner[contentId] = newOwner;
        _distributors[contentId][newOwner] = true;
    }

    // mint a NFT for contentId to 'to' and it will burn after endtime.
    function mint(
        address to,
        uint256 contentId,
        uint256 endtime
    ) public returns (uint256) {
        require(
            isContentDistributorOf(contentId, msg.sender),
            "You can't mint this NFT"
        );
        require(!hasNFTForContent(to, contentId), "NFT already minted");

        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();
        _nftContentId[tokenId] = contentId;
        _endTimes[tokenId] = endtime;

        _mint(to, tokenId);

        emit MintNFT(to, contentId);

        return tokenId;
    }

    // return true if owner have NFT for contentId and time in period.
    function hasNFTForContent(address owner, uint256 contentId)
        public
        view
        returns (bool)
    {
        uint256 total = countOfNFT();

        for (uint256 token = 0; token < total; token++) {
            if (ownerOf(token) == owner && contentOf(token) == contentId) {
                return _endTimes[token] >= block.timestamp;
            }
        }

        return false;
    }

    // return NFT tokenId of msg.sender for contentId
    function getNFTForContent(uint256 contentId) public view returns (uint256) {
        uint256 total = countOfNFT();

        for (uint256 token = 0; token < total; token++) {
            if (
                ownerOf(token) == msg.sender &&
                contentOf(token) == contentId &&
                _endTimes[token] >= block.timestamp
            ) {
                return token;
            }
        }

        return uint256(int256(-1));
    }

    // returns a array of bool like hasNFTForContent.
    function hasNFTForContents(address owner, uint256[] memory contentIds)
        public
        view
        returns (bool[] memory)
    {
        uint256 len = contentIds.length;
        bool[] memory result = new bool[](len);
        uint256 total = countOfNFT();

        for (uint256 i = 0; i < len; i++) {
            result[i] = false;
            for (uint256 token = 0; token < total; token++) {
                if (
                    ownerOf(token) == owner &&
                    contentOf(token) == contentIds[i] &&
                    _endTimes[token] >= block.timestamp
                ) {
                    result[i] = true;
                    break;
                }
            }
        }

        return result;
    }

    // return contentId of tokenId in period time.
    function contentOf(uint256 tokenId) public view returns (uint256) {
        if (_endTimes[tokenId] >= block.timestamp) {
            return _nftContentId[tokenId];
        }

        return 0;
    }

    // return owner address of contentId.
    function contentOwnerOf(uint256 contentId) public view returns (address) {
        return _distributionOwner[contentId];
    }

    // return true if 'distributor' is distributor of contentId
    function isContentDistributorOf(uint256 contentId, address distributor)
        public
        view
        returns (bool)
    {
        return _distributors[contentId][distributor];
    }

    // return a array of bool like isContentDistributorOf
    function isDistributorOfContents(address owner, uint256[] memory contentIds)
        public
        view
        returns (bool[] memory)
    {
        uint256 len = contentIds.length;
        bool[] memory results = new bool[](len);

        for (uint256 i = 0; i < len; i++) {
            results[i] = _distributors[contentIds[i]][owner];
        }

        return results;
    }

    // return true if 'owner' is owner of contentId.
    function isOwnerOf(address owner, uint256 contentId)
        public
        view
        returns (bool)
    {
        return
            contentOwnerOf(contentId) == address(0)
                ? true
                : _distributors[contentId][owner];
    }

    // return true if either 'owner' is owner of conentId of 'owner' has NFT for contentId in period time.
    function canSeeProtected(address owner, uint256 contentId)
        public
        view
        returns (bool)
    {
        return
            isOwnerOf(owner, contentId) || hasNFTForContent(owner, contentId);
    }

    // burn a NFT (don't use)
    function _burn(uint256 tokenId) internal override {
        super._burn(tokenId);
    }

    // return total count of NFT
    function countOfNFT() public view returns (uint256) {
        return _tokenIdCounter.current();
    }

    // withdraw
    function withdraw() public onlyOwner {
        payable(msg.sender).transfer(address(this).balance);
    }

    // get base uri.
    function _baseURI() internal view override returns (string memory) {
        return _strBaseTokenURI;
    }

    // return token uri.
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
                ? string(
                    abi.encodePacked(
                        baseURI,
                        contentOf(tokenId).toString(),
                        ".json"
                    )
                )
                : "";
    }

    // get new content Id
    function newContentId() public view returns (uint256) {
        require(isContentServer(msg.sender), "You don't permitted this action");
        uint256 id;
        do {
            id = uint256(
                keccak256(abi.encodePacked(msg.sender, block.timestamp))
            );
        } while (isSetted(id));

        return id;
    }
}
