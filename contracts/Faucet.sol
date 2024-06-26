// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

contract Faucet is Initializable, AccessControl {

    mapping(address account => uint256 timestamp) private _lastFaucet;

    bytes32 private constant ROLE_ADMIN = keccak256("ROLE_ADMIN");

    event FaucetEvent(address indexed from, address indexed to, uint256 amount);
    event FundsReceived(address indexed from, uint256 amount);

    error DailyLimitReached(address account, uint256 timestamp);

    modifier checkTimestamp(address _to) {
        if (_lastFaucet[_to] + 1 days > block.timestamp) {
            revert DailyLimitReached(_to, _lastFaucet[_to]);
        }
        _;
    }

    receive() external payable {
        emit FundsReceived(msg.sender, msg.value);
    }

    function initialize() public initializer {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
    _grantRole(ROLE_ADMIN, msg.sender);
    }

    function faucet(address _to, uint256 _amount) public checkTimestamp(_to) onlyRole(ROLE_ADMIN) {
        require(hasRole(ROLE_ADMIN, msg.sender), "Faucet: only admin can call this function");
        _faucet(_to, _amount);
        emit FaucetEvent(msg.sender, _to, _amount);
    }

    function _faucet(address _to, uint256 _amount) internal {
        payable(_to).transfer(_amount);
        _lastFaucet[_to] = block.timestamp;
    }

    function getLastFaucet(address _account) public view returns (uint256) {
        return _lastFaucet[_account];
    }

    function addAdmin(address _account) public onlyRole(DEFAULT_ADMIN_ROLE) {
        _grantRole(ROLE_ADMIN, _account);
    }

    function removeAdmin(address _account) public onlyRole(DEFAULT_ADMIN_ROLE) {
        _revokeRole(ROLE_ADMIN, _account);
    }
}
