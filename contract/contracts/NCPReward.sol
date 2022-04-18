//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract NCPReward is ERC20 {
    constructor() ERC20("GoofyGoober", "GG") {
        _mint(msg.sender, 10 ** 6 * 10 ** decimals());
    }
}