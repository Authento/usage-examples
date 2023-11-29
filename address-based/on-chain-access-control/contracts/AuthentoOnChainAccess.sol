//SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import "@openzeppelin/contracts/utils/cryptography/MessageHashUtils.sol";

contract AuthentoOnChainAccess is ERC721, Ownable {
    using ECDSA for bytes32;
    uint256 private tokenIdCounter;

    constructor(
        address initialOwner
    ) ERC721("Authento On Chain Access", "AUX") Ownable(initialOwner) {}

    function _recoverSigner(
        uint256 expireTs,
        bytes memory signature
    ) private view returns (address) {
        bytes32 messageHash = MessageHashUtils.toEthSignedMessageHash(
            keccak256(abi.encodePacked(msg.sender, expireTs))
        );
        return ECDSA.recover(messageHash, signature);
    }

    function mint(uint256 expireTs, bytes memory signature) external {
        require(block.timestamp < expireTs, "Expired");
        require(
            _recoverSigner(expireTs, signature) == owner(),
            "Incorrect signature"
        );
        _safeMint(msg.sender, tokenIdCounter++);
    }
}
