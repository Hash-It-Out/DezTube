import React, {Component} from 'react';
import './App.css';
import web3 from './web3';
import Button from 'react-bootstrap/lib/Button';
import {abi, address} from './contract';
import {abi2,address2} from "./contract2";
import ipfs from './ipfs';


let contract;
let donateContract;
class App extends Component{
    
    state={
        ipfsHash:'',
        isMetaMask:'',        
        buffer:'',
        username:'',
        video:[]
    }


    async componentDidMount() {

        if (typeof window.web3 !== 'undefined') {
            console.log('web3 is enabled');
            if (web3.currentProvider.isMetaMask === true) {
                await this.setState({isMetaMask: true});
                console.log('MetaMask is active');
            } else {
                console.log('MetaMask is not available')
            }
        } else {
            console.log('web3 is not found')
        }

        if (this.state.isMetaMask) {
            contract = new web3.eth.Contract(abi, address);
            donateContract=new web3.eth.Contract(abi2,address2);
            // console.log(contract);
            // console.log(donateContract);
            try{    
                const accounts=await web3.eth.getAccounts();
                
                const usersCount=await contract.methods.countUsers().call();
                // console.log(usersCount);
                let listOfVideos=[]
                for(var i=0;i<usersCount;i++){
                    const user=await contract.methods.Users(i).call();
                    const username=await contract.methods.Username(user).call();
                    if(user===accounts[0]){
                        console.log("currentuser:",username);
                        this.setState({username:username});
                    }
                    // console.log(username);

                    const contributorNum=await contract.methods.contributorlength().call({
                        "from":user
                    })
                
                    console.log(contributorNum);
                    for(var j=0;j<contributorNum;j++){
                        const ipfshash=await contract.methods.contributor(user,j).call();
                        console.log(ipfshash['ipfshash']);
                        let dic={};
                        dic[username]=ipfshash['ipfshash'];
                        listOfVideos.push(dic);
                    }
                

                }
                // console.log(list);
                this.setState({video:listOfVideos});
                // console.log(this.state.video);
                

                
            }catch(err){
                console.log(err);
            }   
        }

    };


    captureFile=(event)=>{
        console.log("event");
        event.stopPropagation();
        event.preventDefault();
        const file=event.target.files[0];
        let reader=new window.FileReader();
        reader.readAsArrayBuffer(file);
        reader.onloadend = () => {
            this.setState({ buffer: Buffer(reader.result) })
            console.log('buffer', this.state.buffer)
        }
        
    };

    // convertToBuffer=async(reader)=>{
    //     console.log("convert event");
    //     const buffer=await Buffer.from(reader.result);
    //     console.log(this.state.buffer);
    //     this.setState({buffer});
    //     // console.log(this.state.buffer);
        
    // };
    uploadVideo= async(event)=>{
        
        event.preventDefault();
        const accounts= await web3.eth.getAccounts();
        console.log(accounts[0]);

        ipfs.files.add(this.state.buffer,(err,ipfsHash)=>{
            console.log("ipfs");
        
            console.log(err);           
            // console.log(ipfsHash[0]); 
            console.log(ipfsHash[0].path);
            const ipfsHashCode=ipfsHash[0].path;

            contract.methods.InsertContent(ipfsHashCode,0,0).send({
                "from":accounts[0]
            }).then((reciept)=>{
                console.log(reciept);
            });

        });

        
    };

    addUsername=async(event)=>{
        event.preventDefault();
        const data= new FormData(event.target);
        const username=data.get("username");
        const accounts=await web3.eth.getAccounts();

        console.log(accounts[0]);
        try{

            contract.methods.register(username).send({
                "from":accounts[0]

            }).then((result)=>{
                // console.log(err);
                console.log(result);
                
            });
        }catch(err){
        
            console.log(err);
        }

        

    };
    retreiveUsers=async(event)=>{
        try
        {
            // contract.Users.call((err,result)=>{
            //     console.log(result);
            // });
            // const users=await contract.methods.Users(0).call();
            const accounts=await web3.eth.getAccounts();
            const usersCount=await contract.methods.countUsers().call();
            console.log(usersCount);
            for(var i=0;i<usersCount;i++){
                const user=await contract.methods.Users(i).call();
                const username=await contract.methods.Username(user).call();
                console.log(username);
                const contributorNum=await contract.methods.contributorlength().call({
                    "from":user
                })
                console.log(contributorNum);
                for(var j=0;j<contributorNum;j++){
                    const ipfshash=await contract.methods.contributor(user,j).call();
                    console.log(ipfshash['ipfshash']);
                    
    
                }

            }
            
            
        }catch(err){
            console.log(err);
        }
    }
    donate=async(event)=>{
        console.log("event");
        event.preventDefault();

        const data= new FormData(event.target);
        const amount=data.get("value");
        const id=data.get("id");
        const accounts=await web3.eth.getAccounts();
        const usersCount=await contract.methods.countUsers().call();
        console.log(usersCount);
        for(var i=0;i<usersCount;i++){
            const user=await contract.methods.Users(i).call();
            const username=await contract.methods.Username(user).call();
            if(username===id){
                await(donateContract.methods.donate(user).send({
                    "from":accounts[0],
                    "value": web3.utils.toWei(amount),
                    
                }));   
            }
            console.log(username);

        }
        
    

    }

    retreiveVideos=async()=>{
        console.log("clicked");
        // try{
        //     const accounts=await web3.eth.getAccounts();
        //     const usersCount=await contract.methods.countUsers().call();
            
        //     console.log(usersCount);
        //     let table=[];
        //     for(var i=0;i<usersCount;i++){
        //         const user=await contract.methods.Users(i).call();
        //         const username=await contract.methods.Username(user).call();
        //         console.log(username);
        //         let contributorVideos=[];
        //         contributorVideos.push(<td>`${user}`</td>)    
        //         const contributorNum=await contract.methods.contributorlength().call({
        //             "from":user
        //         })
        //         console.log(contributorNum);
        //         for(var j=0;j<contributorNum;j++){
                    
        //             const ipfshash=await contract.methods.contributor(user,j).call();
        //             const ipfsHashFinal=ipfshash['ipfshash'];
        //             console.log(ipfsHashFinal);
        //             contributorVideos.push(<td>`${ipfsHashFinal}`</td>);
        //             console.log(ipfshash['ipfshash']);

        //         }
        //         table.push(<tr>{contributorVideos}</tr>);

        //     }
            
        //     return table;

        // }catch(err){
        //     console.log(err);
        // }
    }

    render(){
        // const vals ={this.state.video};
        const val=this.state.video;
        // console.log(val);
        const video=[]
        val.forEach((e,i)=>{
            console.log(e);
            for(let key in e){
                console.log(key);
                console.log(e[key]);
                // const accounts=web3.eth.getAccounts();
                // const username=contract.methods.Username(accounts[0]).call();
                const username=this.state.username;
                if(username===key){
                video.push(<li>{key}
                <video height="320" height="240" controls>
                    <source src={`https://ipfs.io/ipfs/${e[key]}`} type="video/mp4"/>
                </video>
                {/* <form onSubmit={this.donate}>
                    <input name="value" type="text"/>
                    <input name="id" value={key} type="hidden"/>
                    <input type="submit" name="submit"/>
                </form> */}
                </li>);
                }else{
                    video.push(<li>{key}
                        <video height="320" height="240" controls>
                            <source src={`https://ipfs.io/ipfs/${e[key]}`} type="video/mp4"/>
                        </video>
                        <form onSubmit={this.donate}>
                            <input name="value" type="text"/>
                            <input name="id" value={key} type="hidden"/>
                            <input type="submit" name="submit"/>
                        </form>
                        </li>);
                }
            }
            // console.log(i);
        });
        
        return(
            <div>
            <form onSubmit={this.uploadVideo}>
                <input type="file" onChange={this.captureFile}/> 

                <input type="submit" name="submit"/>

            </form>
            <button onClick={this.retreiveUsers}>View</button>
            <form onSubmit={this.addUsername}>
                <label>Username</label>
                <input name="username" type="text"/>
                <input type="submit" name="submit"/>
            </form>

            <div className="App">
            {/*               */}
                {/* {this.retreiveVideos()} */}
{/*             
            <table>
                <tbody>
                    {video}
                </tbody>
            </table> */}
            <ul>
                {video}
            </ul>
            </div>
                
            </div>
        );      
    }


    

}



export default App;


