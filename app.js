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
});

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname,'views'))

app.use(express.urlencoded({ extended: true}))

app.get('/', (req, res) => {
  res.render('home')
});

app.get('/campgrounds', async (req,res) => {
    const Campgrounds = await Campground.find({});
    res.render('campgrounds/index', { Campgrounds })
});

app.get('/campgrounds/new',(req,res) => {
  res.render('campgrounds/new');
});

app.post('/campgrounds', async(req, res) =>{
  const campground = new Campground(req.body.campground);
  await campground.save();
  res.redirect(`/campgrounds/${campground._id}`)
})

app.get('/campgrounds/:id', async (req,res) => {
  const campground = await Campground.findById(req.params.id)
  res.render('campgrounds/show',{ campground });
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
});