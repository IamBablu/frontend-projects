// require('dotenv').config({path: './env'})
import dotenv from 'dotenv';
import DBConnect from "./db/index.js";
dotenv.config({path: './env'})
import { app } from './app.js';

DBConnect()
.then(()=>{
    app.on("error",(err)=>{
        console.log("An error has occured",err);
        throw err
    })
    app.listen(process.env.PORT || 9000, ()=>{
        console.log(`DB Connect Successfully! Ha Ha Hi Hi! at port: ${process.env.PORT}`)
    })
})
.catch((error)=>{
    console.log("DB Connection Faild", error)
})



















/*
import express from 'express';
const app = express();
;(async ()=>{
    try {
        await mongoose.connect(`${process.env.DB_URI}/${DB_NAME}`);
        app.on('error',(e)=>{
            console.log("error",e)
            throw e
        })

        app.listen(process.env.PORT, ()=>{
            console.log(`App listen on port ${process.env,PORT}`)
        })
    } catch (error) {
        console.error("Error occured", error);
        throw error
    }
})()*/