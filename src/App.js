import React, {Component} from 'react';
import './App.css';
import web3 from './web3';
import Button from 'react-bootstrap/lib/Button';
// import {abi, address} from './contract';
import ipfs from './ipfs';


let contract;
class App extends Component{
    
    state={
        ipfsHash:'',
        isMetaMasl:'',        
        buffer:''

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
            // contract = new web3.eth.Contract(abi, address);
        }

    };


    captureFile=(event)=>{
        event.stopPropagation();
        event.preventDefault();
        const file=event.target.files[0];
        let reader=new window.FileReader();
        reader.readAsArrayBuffer(file);
        reader.onloaded=()=>this.convertToBuffer(reader);

        
    };

    convertToBuffer=async(reader)=>{
        const buffer=await Buffer.from(reader.result);
        this.setState({buffer});
        
    };
    uploadVideo= async(event)=>{
        event.preventDefault();
        const accounts= await web3.eth.getAccounts();


        await ipfs.add(this.state.buffer,(err,ipfsHash)=>{
            console.log(ipfsHash);
            this.setState({ipfsHash:ipfsHash[0].hash});

        });

        
    };

    render(){
        return(
            <div>
            <form onSubmit={this.upload}>
                <input type="file" onChange={this.captureFile}/> 

                <input type="submit" name="submit"/>

            </form>
            <div className="App">
                <p>"working"</p>
            </div>

            </div>
        );      
    }


    

}



export default App;


