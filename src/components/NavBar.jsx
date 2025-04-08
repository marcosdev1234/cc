import React from 'react'
import logo from '../assets/title.png';
import InfoOutlineIcon from '@mui/icons-material/InfoOutline';
import QueryStatsIcon from '@mui/icons-material/QueryStats';
import CoinDisplay from './CoinDisplay.jsx';
import { Link } from 'react-router-dom';
import "../App.css"
const NavBar = () => {
  return (
    <nav className='navBar'>
    <div style={{display:"flex",alignItems:"center"}}> 
  <Link
   to="/">
      <img src={logo}/>
      
      </Link>
      <CoinDisplay />
      </div>
      <div>
    <Link to={"/info"}>
    <InfoOutlineIcon sx={{color:"#675BF0",fontSize:"25px"}}/>
    </Link>
        <Link to={"/about"}>
        <QueryStatsIcon sx={{color:"#675BF0",fontSize:"25px"}}/>
        </Link>
      </div>
  </nav>
  )
}

export default NavBar
