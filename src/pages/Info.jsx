import React from "react";
import one from "../assets/1.png"
import two from "../assets/2.png"
import three from "../assets/3.png"
import "./Info.css"
import NavBar from "../components/NavBar";
 const Info = () => {
  return (<>
 <NavBar/> 
    <div className="infocont">
      <div className="datacard">
        <img  src={one}/>
        <h2>Create Token</h2>
        <p>
          Log in with your wallet. Enter the token details. Pay to inject
          liquidity and use the bot. (We recommend having between 50 and 200 USD
          in your account.)
        </p>
        </div>
        <div className="datacard">
        <img  src={two}/>
        <h2>Use trading Bots</h2>
        <p>
          Use 1/5 trading bots to generate market movement (this will attract
          new investors)
        </p>
        </div>
        <div className="datacard">
        <img src={three}/>
        <h2>Run the rug</h2>
        <p>
          Monitor your currency chart and wait for the right moment to withdraw
          all the money.
        </p>
        </div>
     
    </div>
    </>
  );
};

export default Info;
