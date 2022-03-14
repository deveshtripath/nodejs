import dotenv from "dotenv"
import express from 'express'
import cors from 'cors';

dotenv.config()

import connectDB from "./config/connectdb.js";
import userRoutes from './routes/userRoutes.js'

const app = express()

const DATABASE_URL = process.env.DATABASE_URL
const port = process.env.PORT;

app.use(cors())

//Database calling
connectDB(DATABASE_URL)


//JSON
app.use(express.json())

// load Routes
app.use("/api/user", userRoutes)


app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
})