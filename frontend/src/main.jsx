import React from 'react';
import ReactDOM from 'react-dom/client';
import { Route, RouterProvider, createRoutesFromElements } from 'react-router';
import { createBrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';

import store from './Redux/store.js';
import App from './App.jsx';
import Login from './Pages/Auth/Login.jsx';
import Register from './Pages/Auth/Register.jsx';
import PrivateRoute from './components/PrivateRoute.jsx';
import Profile from './Pages/User/profile.jsx';
import Home from './Pages/Home.jsx';
import Favourites from './Pages/Products/Favourites.jsx';
import ProductDetails from './Pages/Products/ProductDetails.jsx';
import Cart from './Pages/Cart.jsx';
import Shop from './Pages/Shop.jsx';
import AdminRoute from './Pages/Admin/AdminRoute.jsx';
import UserList from './Pages/Admin/UserList.jsx';
import './index.css';
import CategoryList from './Pages/Admin/CategoryList.jsx';
import ProductList from './Pages/Admin/ProductList.jsx';
import AllProductList from './Pages/Admin/AllProductList.jsx';
import ProductUpdate from './Pages/Admin/ProductUpdate.jsx';
import Shipping from './Pages/Orders/Shipping.jsx';
import PlaceOrder from './Pages/Orders/PlaceOrder.jsx';
import Order from './Pages/Orders/Order.jsx';
import OrderList from './Pages/Admin/OrderList.jsx';

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>
      <Route index={true} path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/favourites" element={<Favourites />} />
      <Route path="/product/:id" element={<ProductDetails />} />
      <Route path="/cart" element={<Cart />} />
      <Route path="/shop" element={<Shop />} />

      {/* {Registerd Users} */}

      <Route path="/" element={<PrivateRoute />}>
        <Route path="/profile" element={<Profile />} />
        <Route path="/shipping" element={<Shipping />} />
        <Route path="/placeorder" element={<PlaceOrder />} />
        <Route path="/order/:id" element={<Order />} />
      </Route>

      <Route path="/admin" element={<AdminRoute />}>
        <Route path="userlist" element={<UserList />} />
        <Route path="categorylist" element={<CategoryList />} />
        <Route path="productlist" element={<ProductList />} />
        <Route path="allproductlist" element={<AllProductList />} />
        <Route path="product/update/:_id" element={<ProductUpdate />} />
        <Route path="orderlist" element={<OrderList />} />
      </Route>
    </Route>
  )
);


ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
        <RouterProvider router={router} />
    </Provider>
  </React.StrictMode>
);
