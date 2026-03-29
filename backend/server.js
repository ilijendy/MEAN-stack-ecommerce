const express = require("express");
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("Connected to MongoDB"))
    .catch((err) => console.error("MongoDB connection error:", err.message));

app.get("/", (req, res) => {
    res.send("Hello World");
});

const authRoutes=require("./routes/auth.routes");
app.use("/api/auth",authRoutes);

const userRoutes=require("./routes/user.routes");
app.use("/api/user",userRoutes);

const productRoutes=require("./routes/product.routes");
app.use("/api/product",productRoutes);

const cartRouters=require('./routes/cart.routes');
app.use('/api/cart',cartRouters);
   
const orderRouter=require('./routes/order.routes');
app.use('/api/order',orderRouter);

const PORT = process.env.PORT;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});