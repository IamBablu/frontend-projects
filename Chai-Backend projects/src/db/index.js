import mongoose from "mongoose";
import { DB_NAME } from "../constans.js";

const DBConnect = async ()=>{
    try {
        const ConnectionInstance = await mongoose.connect(`${process.env.DB_URI}/${DB_NAME}`);
        console.log(`Connection established haaa haa!!; DB Host:  ${ConnectionInstance.connection.host}`)
    } catch (error) {
        console.log("Connection Error ",error)
        process.exit(1);
    }
}
export default DBConnect;