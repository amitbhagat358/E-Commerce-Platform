import { useEffect } from "react";
import { FaHeart, FaRegHeart, FaVaadin } from "react-icons/fa";
import { useSelector, useDispatch } from "react-redux";
import {
  addToFavourites,
  removeFromFavourites,
  setFavourites,
} from "../../Redux/features/favourites/favouriteSlice";

import {
  addFavouriteToLocalStorage,
  getFavouritesFromLocalStorage,
  removeFavouriteFromLocalStorage,
} from "../../Utils/localStorage.js";

const HeartIcon = ({ product }) => {
  const dispatch = useDispatch();
  const favourites = useSelector((state) => state.favourites) || [];
  console.log(favourites);
  const isFavourite = favourites.some((p) => p._id === product._id);

  useEffect(() => {
    const favouritesFromLocalStorage = getFavouritesFromLocalStorage();
    dispatch(setFavourites(favouritesFromLocalStorage));
  }, []);

  const toggleFavourites = () => {
    if (isFavourite) {
      dispatch(removeFromFavourites(product));
      removeFavouriteFromLocalStorage(product._id);
    } else {
      dispatch(addToFavourites(product));
      addFavouriteToLocalStorage(product);
    }
  };

  return (
    <div
      className="absolute top-2 right-5 cursor-pointer"
      onClick={toggleFavourites}
    >
      {isFavourite ? (
        <FaHeart className="text-pink-500" />
      ) : (
        <FaRegHeart />
      )}
    </div>
  );
};

export default HeartIcon;