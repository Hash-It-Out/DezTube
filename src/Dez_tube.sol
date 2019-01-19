pragma solidity ^0.4.20;

contract Dez_tube{

    //Array of Viewers
    address[] Users;
    string name;
    //Map of address and username
    mapping( address => string) Username;
    //struct of COntributor
    struct content{
        string ipfshash;
        uint like;
        uint donate;
    }
    //mapping contributions
    mapping( address => content[] ) contributor;
    
    //Functions
    //return count of all users
    function countUsers() public view returns(uint){
        return Users.length;
    }
    
    //Insert content
    function InsertContent(string _ipfshash, uint _like, uint _donate) public{
        
        contributor[msg.sender].push(content(_ipfshash,_like,_donate));
        
    }
    
    //Register
    function register(string _name) public {
       
        Users.push(msg.sender);
        Username[msg.sender] = _name;
    }
    
    
}
