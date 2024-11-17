const express = require("express");
const app = express();
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const path = require("path");
const expressError =require("./Utils/expressError.js");
const categoryRouter =require("./Routes/categoryRoutes.js");
const productRouter=require("./Routes/productRoutes.js");

//default template  and Middlwares
app.set("view engine", "ejs");
app.set("Views", path.join(__dirname, "Views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "/public")));


app.use('/category', categoryRouter);
app.use('/product', productRouter);

// Root API
app.get("/",(req,res)=>{
    res.send("Root Path")
})

app.all("*", (req, res, next) => {
  next(new expressError(404, "Page Not Found"));
});


//Custom error handeling
app.use((err, req, res, next) => {
  let { statusCode = 500, message = "Something Went Wrong" } = err;
  // res.status(statusCode).send(message);
  // console.error(err);
  res.status(statusCode).send({ message });
});

const port = 8000;
app.listen(port, () => {
  console.log(`Server is running on portal ${port}`);
});