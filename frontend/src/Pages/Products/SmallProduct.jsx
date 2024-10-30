import { Link } from "react-router-dom";
import HeartIcon from "./HeartIcon";

const SmallProduct = ({ product }) => {
  return (
    <div className="w-[20rem] h-auto bg-white shadow-md rounded-lg overflow-hidden">
      <div className="relative w-full h-40">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-contain rounded-t-lg mt-1"
        />
        <div className="absolute top-2 right-2">
          <HeartIcon product={product} />
        </div>
      </div>

      <div className="p-4">
        <Link to={`/product/${product._id}`}>
          <h2 className="text-lg font-semibold text-gray-800 mb-2">
            {product.name}
          </h2>
        </Link>
        <span className="bg-pink-100 text-pink-800 text-sm font-medium px-3 py-1 rounded-full">
          ₹{' '}{product.price}
        </span>
      </div>
    </div>
  );
};

export default SmallProduct;
