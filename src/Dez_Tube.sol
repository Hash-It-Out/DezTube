pragma solidity ^0.4.20;

contract Dez_tube{

    //Array of Viewers
    address[] public Users;
    string public name;
    //Map of address and username1
    mapping( address => string) public Username;
    //struct of COntributor
    struct content{
        string ipfshash;
        uint like;
        uint donate;
    }
    
    //mapping contributions
    mapping( address => content[] ) public contributor;
    
    //Functions
    //return count of all users
    function countUsers() public view returns(uint){
        
        return Users.length;
    }
    
    function contributorlength() public view returns(uint){
        return contributor[msg.sender].length;
    }
    
    //Insert content
    function InsertContent(string _ipfshash, uint _like, uint _donate) public{
        
        contributor[msg.sender].push(content(_ipfshash,_like,_donate));
        
        
    }
    
    //Register
    function register(string _name) public returns(bool) {
       
        Users.push(msg.sender);
        Username[msg.sender] = _name;
        return true;
    }
    
    
}
