import  Express, { Application , Request, Response}  from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db";
import authRoutes from "./routes/auth.routes";



dotenv.config();

const app : Application=Express();

//Middleware
connectDB();
app.use(cors());
app.use(Express.json());

//Test Route
app.use("/api/auth", authRoutes);
app.get("/",(req :Request, res : Response) => {
    res.status(200).json({
        message:"Code Rangers Api running",
    });
});

const PORT =process.env.PORT || 5000;

app.listen(PORT,()=>{
    console.log(`Server running on Port ${PORT}`);
});