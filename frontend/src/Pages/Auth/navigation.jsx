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
import { useSelector, useDispatch } from 'react-redux';
import { useLogoutMutation } from '../../Redux/api/usersApiSlice';
import { logout } from '../../Redux/features/auth/authSlice';

const Navigation = () => {
  const { userInfo } = useSelector((state) => state.auth);

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
    <div
      style={{ zIndex: 5 }}
      className={`${
        showSidebar ? 'hidden' : 'flex'
      } xl:flex lg:flex flex-col text-white bg-[#000] w-16 h-[100vh] sticky top-0`}
      id="navigation-container"
    >
      <div className="flex flex-col justify-evenly items-center fixed w-16 h-[50vh] space-y-4">
        <Link to="/" className="flex items-center">
          <AiOutlineHome className="" size={26} />
        </Link>

        <Link to="/shop" className="flex items-center">
          <AiOutlineShopping className="" size={26} />
        </Link>

        <Link to="/cart" className="flex items-center">
          <AiOutlineShoppingCart className="" size={26} />
        </Link>

        <Link to="/favourites" className="flex relative">
          <div className="flex justify-center items-center">
            <FaHeart className="" size={20} />
          </div>
        </Link>
      </div>

      <div className="flex flex-col gap-5 fixed bottom-20 w-16 ">
        <button
          onClick={toggleDropdown}
          className="flex items-center text-gray-800 focus:outline-none bg-red-700"
        >
          {userInfo ? (
            <span className="text-white">{userInfo.username}</span>
          ) : (
            <></>
          )}
          {userInfo && (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className={`h-4 w-4 ml-1 ${
                dropdownOpen ? 'transform rotate-180' : ''
              }`}
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
          <ul
            className={`absolute z-10 left-20 mt-2 space-y-2 bg-[#56565c] text-white ${
              !userInfo.isAdmin ? '-top-20' : '-top-80'
            } `}
          >
            {userInfo.isAdmin && (
              <>
                <li>
                  <Link
                    to="/admin/dashboard"
                    className="block px-4 py-2 hover:bg-gray-100 hover:text-black"
                  >
                    Dashboard
                  </Link>
                </li>
                <li>
                  <Link
                    to="/admin/productlist"
                    className="block px-4 py-2 hover:bg-gray-100 hover:text-black"
                  >
                    Products
                  </Link>
                </li>
                <li>
                  <Link
                    to="/admin/categorylist"
                    className="block px-4 py-2 hover:bg-gray-100 hover:text-black"
                  >
                    Category
                  </Link>
                </li>
                <li>
                  <Link
                    to="/admin/orderlist"
                    className="block px-4 py-2 hover:bg-gray-100 hover:text-black"
                  >
                    Orders
                  </Link>
                </li>
                <li>
                  <Link
                    to="/admin/userlist"
                    className="block px-4 py-2 hover:bg-gray-100 hover:text-black"
                  >
                    Users
                  </Link>
                </li>
              </>
            )}

            <li>
              <Link
                to="/profile"
                className="block px-4 py-2 hover:bg-gray-100 hover:text-black"
              >
                Profile
              </Link>
            </li>
            <li>
              <button
                onClick={logoutHandler}
                className="block w-full px-4 py-2 text-left hover:bg-gray-100 hover:text-black"
              >
                Logout
              </button>
            </li>
          </ul>
        )}
        {!userInfo && (
          <div className="flex flex-col gap-5 fixed bottom-20 w-16">
            <div className="flex justify-center items-center">
              <Link to="/login" className="flex items-center mt-5">
                <AiOutlineLogin className="mr-2 mt-[4px]" size={26} />
              </Link>
            </div>
            <div className="flex flex-col justify-center items-center">
              <Link to="/register" className="flex items-center mt-5">
                <AiOutlineUserAdd size={26} />
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navigation;
