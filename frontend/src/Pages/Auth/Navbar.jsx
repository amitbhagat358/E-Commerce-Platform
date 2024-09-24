import React from 'react';
import { IconContext } from 'react-icons';
import { Link, useNavigate } from 'react-router-dom';

import { IoSearchOutline } from 'react-icons/io5';
import { IoCartOutline } from 'react-icons/io5';
import { AiOutlineUser } from 'react-icons/ai';

import { useSelector, useDispatch } from 'react-redux';
import { useLogoutMutation } from '../../Redux/api/usersApiSlice.js';
import { logout } from '../../Redux/features/auth/authSlice.js';
import { toast } from 'react-toastify';

const Logo = () => {
  return <div className="logo">logo</div>;
};

const Searchbar = () => {
  return (
    <div className="searchbar">
      <IconContext.Provider
        value={{ color: 'black', size: '20px', className: 'react-icons' }}
      >
        <IoSearchOutline />
      </IconContext.Provider>
      <input className="searchInput" type="text" placeholder="Search Product" />
    </div>
  );
};

const Navbar = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [logoutApiCall] = useLogoutMutation();

  const logOutHandler = async () => {
    try {
      await logoutApiCall().unwrap();
      dispatch(logout());
      toast.success("successfully logged out");
      navigate('/login');
    } catch (error) {
      toast.error("error while logging out");
    }
  };

  return (
    <>
      <div className="navbar">
        <Logo />
        <Searchbar />

        <Link to="/cart">
          <IconContext.Provider
            value={{ color: 'black', size: '30px', className: 'react-icons' }}
          >
            <IoCartOutline />
            <span> Cart</span>
          </IconContext.Provider>
        </Link>

        <Link to="/">
          <IconContext.Provider
            value={{ color: 'black', size: '30px', className: 'react-icons' }}
          >
            <AiOutlineUser />
          </IconContext.Provider>

          {userInfo ? <span>{userInfo.username}</span> : null}
        </Link>
      </div>
      {userInfo ? <button
        onClick={() => {
          console.log("after onclick");
          logOutHandler();
        }}
        style={{
          zIndex: '1000',
          position: 'absolute',
          left: '50%',
          top: '50%',
          cursor: 'pointer',
        }}
      >
        logout
      </button> : null}
    </>
  );
};

export default Navbar;
