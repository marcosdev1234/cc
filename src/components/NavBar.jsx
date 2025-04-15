import React from 'react'
import logo from '../assets/title.png';
import InfoOutlineIcon from '@mui/icons-material/InfoOutline';
import QueryStatsIcon from '@mui/icons-material/QueryStats';
import CoinDisplay from './CoinDisplay.jsx';
import { Link } from 'react-router-dom';
import FacebookIcon from '@mui/icons-material/Facebook';
import XIcon from '@mui/icons-material/X';
import TelegramIcon from '@mui/icons-material/Telegram';
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
      <div style={{display:"flex"}}>
      <Link to={"https://t.me/letmerug"}>
      <TelegramIcon  sx={{color:"#675BF0",fontSize:"25px"}}/>
       </Link>
      <Link to={"https://x.com/RugPullfest"}>
      <XIcon  sx={{color:"#675BF0",fontSize:"25px"}}/>
       </Link>
      <Link to={"https://www.facebook.com/profile.php?id=61575302158529"}>
      <FacebookIcon sx={{color:"#675BF0",fontSize:"25px"}}/>
       </Link>
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
