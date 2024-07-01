import React from 'react';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';

const Logo = () => {
  return (
    <div className="logo">
      Logo
    </div>
  );
};

const Searchbar = () => {
  return (
    <div className='searchbar'>
      <SearchOutlinedIcon sx={{fontSize: "30px",}}/>
      <input className='searchInput' type='text' placeholder='Search Product'/>
    </div>
  )
}


const Navbar = () => {
  return (
    <div className="navbar">
      <Logo />
      <Searchbar />
      <ShoppingCartOutlinedIcon sx={{fontSize: "30px", cursor: "pointer"}} />
      <AccountCircleOutlinedIcon sx={{fontSize: "30px", cursor: "pointer"}} />
    </div>
  );
};

export default Navbar;
