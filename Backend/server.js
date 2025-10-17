import app from "./app.js";
import express from "express";
import cloudinary from "cloudinary"
import appointmentRouter from "./router/appointmentRouter.js";
import errorMiddleware from "./middlewares/errorMiddleware.js";



app.use("/api/v1/appointment", appointmentRouter);
app.use(errorMiddleware);
cloudinary.v2.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
})

app.listen(process.env.PORT, ()=>{
    console.log(`Server listening on port ${process.env.PORT}`);
});



