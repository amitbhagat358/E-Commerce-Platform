import { useState } from 'react';
import {
  AiOutlineHome,
  AiOutlineShopping,
  AiOutlineLogin,
  AiOutlineUserAdd,
  AiOutlineShoppingCart,
} from 'react-icons/ai';
import { FaHeart } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
// import './Navigation.css';
import { useSelector, useDispatch } from 'react-redux';
import { useLogoutMutation } from '../../Redux/api/usersApiSlice';
import { logout } from '../../Redux/features/auth/authSlice';
// import FavoritesCount from '../Products/FavoritesCount';

const Navigation = () => {
  const { userInfo } = useSelector((state) => state.auth);
  // const { cartItems } = useSelector((state) => state.cart);

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [logoutApiCall] = useLogoutMutation();

  const logoutHandler = async () => {
    try {
      await logoutApiCall().unwrap();
      dispatch(logout());
      navigate('/login');
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div style={{ zIndex: 9999 }}>
      <div>
        <Link to="/">
          <AiOutlineHome size={26} />
          <span>HOME</span>{' '}
        </Link>

        <Link to="/shop">
          <AiOutlineShopping size={26} />
          <span>SHOP</span>{' '}
        </Link>

        <Link to="/cart">
          <div>
            <AiOutlineShoppingCart size={26} />
            <span>Cart</span>{' '}
          </div>
{/* 
          <div>
            {cartItems.length > 0 && (
              <span>
                <span>{cartItems.reduce((a, c) => a + c.qty, 0)}</span>
              </span>
            )}
          </div> */}
        </Link>

        <Link to="/favorite">
          <div>
            <FaHeart size={20} />
            <span>Favorites</span> {/* <FavoritesCount /> */}
          </div>
        </Link>
      </div>

      <div className="relative">
        <button onClick={toggleDropdown}>
          {userInfo ? <span>{userInfo.username}</span> : <></>}
          {userInfo && (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="white"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d={dropdownOpen ? 'M5 15l7-7 7 7' : 'M19 9l-7 7-7-7'}
              />
            </svg>
          )}
        </button>

        {dropdownOpen && userInfo && (
          <ul>
            {userInfo.isAdmin && (
              <>
                <li>
                  <Link to="/admin/dashboard">Dashboard</Link>
                </li>
                <li>
                  <Link to="/admin/productlist">Products</Link>
                </li>
                <li>
                  <Link to="/admin/categorylist">Category</Link>
                </li>
                <li>
                  <Link to="/admin/orderlist">Orders</Link>
                </li>
                <li>
                  <Link to="/admin/userlist">Users</Link>
                </li>
              </>
            )}

            <li>
              <Link to="/profile">Profile</Link>
            </li>
            <li>
              <button onClick={logoutHandler}>Logout</button>
            </li>
          </ul>
        )}
        {!userInfo && (
          <ul>
            <li>
              <Link to="/login">
                <AiOutlineLogin size={26} />
                <span>LOGIN</span>
              </Link>
            </li>
            <li>
              <Link to="/register">
                <AiOutlineUserAdd size={26} />
                <span>REGISTER</span>
              </Link>
            </li>
          </ul>
        )}
      </div>
    </div>
  );
};

export default Navigation;
