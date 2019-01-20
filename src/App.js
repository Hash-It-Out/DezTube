import React, {Component} from 'react';
import './App.css';
import web3 from './web3';
import Button from 'react-bootstrap/lib/Button';
// import {abi, address} from './contract';
import ipfs from './ipfs';
import {render} from 'react-dom';

import ReactDOM from "react-dom";

// import { Router, Route, Switch } from "react-router-dom";

import { Router, Route, Link, browserHistory, IndexRoute } from 'react-router'

//history = {browserHistory}
let contract;
class About extends React.Component {
   render() {
      return (
         <div>
            <h1>About...</h1>
         </div>
      )
   }
}


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
 
   // render(){
   //    return (
   //      <div>
   //          <ul>
   //          <li>Home</li>
   //          <li>About</li>
   //          <li>Contact</li>
   //          </ul> 
   //       </div>
   //    )
   // }



}



class Home extends React.Component {
   render() {
      return (
         <div>
            <h1>Home...</h1>
         </div>
      )
   }
}



ReactDOM.render((
   <Router >
      <Route path = "/" component = {Home}/>
      <Route path = "about" component = {About} />
      
   </Router>
));