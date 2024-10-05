import { useSelector } from "react-redux";
import { selectFavouriteProduct } from "../../Redux/features/favourites/favouriteSlice";
import Product from "./Product";

const Favourites = () => {
  const favourites = useSelector(selectFavouriteProduct);

  return (
    <div className="w-[calc(100%-4rem)] pl-16 pt-10">
      <div className="text-2xl font-semibold">
        FAVOURITE PRODUCTS
      </div>

      <div className="flex flex-wrap">
        {favourites.map((product) => (
          <Product key={product._id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default Favourites;