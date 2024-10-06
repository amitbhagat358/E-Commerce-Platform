import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  useCreateProductMutation,
  useUploadProductImageMutation,
} from '../../Redux/api/productApiSlice';
import { useFetchCategoriesQuery } from '../../Redux/api/categoryApiSlice';
import { toast } from 'react-toastify';
import AdminMenu from './AdminMenu';

const ProductList = () => {
  const [image, setImage] = useState('');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('');
  const [quantity, setQuantity] = useState('');
  const [brand, setBrand] = useState('');
  const [stock, setStock] = useState(0);
  const [imageUrl, setImageUrl] = useState(null);
  const navigate = useNavigate();

  const [uploadProductImage] = useUploadProductImageMutation();
  const [createProduct] = useCreateProductMutation();
  const { data: categories } = useFetchCategoriesQuery();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const productData = new FormData();
      productData.append('image', image);
      productData.append('name', name);
      productData.append('description', description);
      productData.append('price', price);
      productData.append('category', category);
      productData.append('quantity', quantity);
      productData.append('brand', brand);
      productData.append('countInStock', stock);

      console.log(productData.category);

      const { data } = await createProduct(productData);

      console.log('data', data);

      if (data.error) {
        toast.error('Product create failed. Try Again.');
      } else {
        toast.success(`${data.name} is created`);
        navigate('/');
      }
    } catch (error) {
      toast.error('Product create failed. Try Again.');
    }
  };

  const uploadFileHandler = async (e) => {
    const formData = new FormData();
    formData.append('image', e.target.files[0]);

    try {
      const res = await uploadProductImage(formData).unwrap();
      toast.success(res.message);
      console.log(res.image);
      const fixedImageUrl = res.image.replace(/\\/g, '/');
      console.log(fixedImageUrl);
      setImage(fixedImageUrl);
      setImageUrl(fixedImageUrl);
    } catch (error) {
      toast.error(error?.data?.message || error.error);
    }
  };

  return (
    <div className="w-[calc(100%-4rem)]">
      <div className="w-full flex justify-center">
        <AdminMenu />
        <div className="flex flex-col justify-center gap-5 w-1/2">
          <div className="text-xl font-semibold">Create Product</div>

          {imageUrl && (
            <div className="text-center">
              <img
                src={imageUrl}
                alt="product"
                className="block mx-auto max-h-[200px]"
              />
            </div>
          )}

          <div className="">
            <label className=" text-white px-4 block border border-gray-500 w-full text-center rounded-lg cursor-pointer font-bold py-5">
              {image ? image.name : 'Upload Image'}

              <input
                type="file"
                name="image"
                accept="image/*"
                onChange={uploadFileHandler}
                className={!image ? 'hidden' : 'text-white'}
              />
            </label>
          </div>

          <div className="one w-full">
            <label htmlFor="name">Name</label> <br />
            <input
              type="text"
              className='h-10 w-full bg-[#323236] text-white border-2 border-gray-600  outline-none p-1  rounded-md'
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="two">
            <label htmlFor="name block">Price</label> <br />
            <input
              type="number"
              className='h-10 w-full bg-[#323236] text-white border-2 border-gray-600  outline-none p-1  rounded-md'
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />
          </div>

          <div className="one">
            <label htmlFor="name block">Quantity</label> <br />
            <input
              type="number"
              className='h-10 w-full bg-[#323236] text-white border-2 border-gray-600  outline-none p-1  rounded-md'
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
            />
          </div>

          <div className="two">
            <label htmlFor="name block">Brand</label> <br />
            <input
              type="text"
              className='h-10 w-full bg-[#323236] text-white border-2 border-gray-600  outline-none p-1  rounded-md'
              value={brand}
              onChange={(e) => setBrand(e.target.value)}
            />
          </div>

          <div className="two">
            <label htmlFor="" className="my-5">
              Description
            </label>
            <textarea
              type="text"
              className='h-10 w-full bg-[#323236] text-white border-2 border-gray-600  outline-none p-1  rounded-md'
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            ></textarea>
          </div>

          <div>
            <label htmlFor="name block">Count In Stock</label> <br />
            <input
              type="text"
              className='h-10 w-full bg-[#323236] text-white border-2 border-gray-600  outline-none p-1  rounded-md'
              value={stock}
              onChange={(e) => setStock(e.target.value)}
            />
          </div>

          <div>
            <label htmlFor="">Category</label> <br />
            <select
              placeholder="Choose Category"
              className='h-10 w-full bg-[#323236] text-white border-2 border-gray-600  outline-none p-1  rounded-md'
              onChange={(e) => setCategory(e.target.value)}
            >
              <option defaultChecked >Select Category</option>
              {categories?.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={handleSubmit}
            className="px-2 py-1 mt-5 w-20 rounded-lg text-lg bg-pink-600"
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductList;
