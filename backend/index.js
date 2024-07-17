import express from 'express'
import dotenv from 'dotenv'
import userRoutes from './Routes/userRoutes.js'
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

app.get('/', (req, res) =>{
  res.send("Hello World !");
})


app.listen(port, ()=> console.log(`listning on port ${port}`));