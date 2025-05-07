
import cors from "cors";
import express from "express"
import routes from "./routes";
import * as dotenv from "dotenv";
import path from "path";

dotenv.config();
const app = express()
const port = process.env.PORT || 8000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors())
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/api/v1', routes);


app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})