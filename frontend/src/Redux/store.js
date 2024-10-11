import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import { apiSlice } from './api/apiSlice.js';
import authReducer from './features/auth/authSlice';
import favouritesReducer from "../Redux/features/favourites/favouriteSlice.js";
import cartSliceReducer from './features/cart/CartSlice.js';
import shopReducer from "./features/shop/shopSlice.js";

import { getFavouritesFromLocalStorage } from "../Utils/localStorage";

const initialFavourites = getFavouritesFromLocalStorage() || [];

const store = configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer,
    auth: authReducer,
    favourites:favouritesReducer,
    cart: cartSliceReducer,
    shop:shopReducer,
  },

  
  preloadedState: {
    favourites: initialFavourites,
  },


  middleware: (getDefaultMiddleWare) =>
    getDefaultMiddleWare().concat(apiSlice.middleware),
  devTools: true,
});

setupListeners(store.dispatch);

export default store;
