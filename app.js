const express = require('express');
const app = express();
const port = 3000;
const path = require('path');
const mongoose = require('mongoose');
const Campground = require('./models/campground');

mongoose.connect('mongodb://localhost:27017/yelp-camp',{
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;
// console.log(db);

db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
})

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname,'views'))

app.get('/', (req, res) => {
  res.render('home')
})

app.get('/makecampground', async (req,res) => {
    const camp = new Campground({ title: 'My Backyard', description: 'nice camping' });
    await camp.save();
    res.send(camp)
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})