//import modules
import express from "express"
import cors from "cors"
import mongoose from "mongoose"


mongoose
  .connect(
    process.env.MONGODB_URL //link to the date base
  )
  .then(() => console.log("Connected to Database"))
  //if all good
  .catch((error) => console.log("Database error", error)) // if with data base some troubles

  let cats = []

  const connection = mongoose.connection;

connection.on("error", console.error.bind(console, "connection error:"));
connection.once("open", async function () {

  const collection  = connection.db.collection("images");
  collection.find().toArray(function(err, data){
      data.map(row => cats.push(row.images))
  });

})
  
const app = express() //application

app.use(express.json()) //json
app.use(cors()) //cors

app.get("/api/randomcat", async (req, res) => {
  try { //if all is good
    const randomCat = cats[0]
    await res.json(randomCat[Math.round(Math.random() * randomCat.length)]) //send random image
  } catch (error) { //if error
    return res.status(500).json({
      message: error,
    })
  }
})

app.listen(process.env.PORT || 4444, (error) => {
  error
    ? console.log("ERROR!") //if with errors
    : console.log("Server OK!") //if without errors
})
