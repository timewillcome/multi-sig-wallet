// SPDX-License-Identifier: MIT
pragma solidity 0.8.22;

contract abc {
  string public greet = "a";
  function get() public view returns (string memory) {
    return greet;
  }
}