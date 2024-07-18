import express from 'express'
import dotenv from 'dotenv'
import userRoutes from './Routes/userRoutes.js'
import categoryRoutes from './Routes/categoryRoutes.js'
import productRoutes from './Routes/productRoutes.js'
import orderRoutes from './Routes/orderRoutes.js'
import connectToDB from './config/db.js';
import cookieParser from 'cookie-parser';

dotenv.config();
connectToDB();


const app = express();
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({extended:true}));

const port = process.env.PORT || 3000;

console.log(process.env.PORT)


app.use('/api/users', userRoutes);
app.use("/api/category", categoryRoutes);
app.use("/api/products" , productRoutes);
app.use("/api/orders", orderRoutes);


app.get('/', (req, res) =>{
  res.send("Hello World !");
})


app.listen(port, ()=> console.log(`listning on port ${port}`));