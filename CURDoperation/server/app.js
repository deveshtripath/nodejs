import express from "express"
import mongoose from "mongoose"
import dotenv from "dotenv"
import bodyParser from "body-parser"
import cors from "cors"
import Routes from "./serve/route.js"

const app = express();

app.use(bodyParser.json({ extended: true }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

app.use('/users', Routes)

const URL = 'mongodb+srv://user:user@cluster0.sw0lr.mongodb.net/curd?retryWrites=true&w=majority'

const PORT = process.env.PORT || '8080';

mongoose.connect(URL, { useNewUrlParser: true, useUnifiedTopology: true }).then(() => {
    app.listen(PORT, () => console.log(`Server is running on PORT: ${PORT}`))
    console.log("data base connected");
}).catch((error) => {
    console.log('Errors:', error.message)
})