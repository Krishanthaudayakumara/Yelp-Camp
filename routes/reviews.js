const express = require('express');
const router = express.Router({ mergeParams: true });
const { reviewSchema } = require('../schemas')
const ExpressError = require('../utils/ExpressError')
const catchAsync = require('../utils/catchAsync')
const Review = require('../models/reviews');
const Campground = require('../models/campground');



const validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if(error){
      const msg = error.details.map(el => el.message).join(',')
      throw new ExpressError(msg, 400)
    } else {
      next();
    }
  }


router.post('/', validateReview, catchAsync(async(req, res) => {
    const campground = await Campground.findById(req.params.id);
    const review = new Review(req.body.review);
    campground.reviews.push(review);
    await review.save();
    await campground.save();
    req.flash('success', 'Created new review!');
    res.redirect(`/campgrounds/${campground._id}`);
    // console.log(review);
  }))
  
router.delete('/:reviewId', catchAsync(async (req,res) => {
    const { id, reviewId } = req.params;
    await Campground.findByIdAndUpdate(id, { $pull: { review:reviewId}});
    await Review.findByIdAndDelete(reviewId);
    req.flash('success', 'Successdfully deleted review!');
    res.redirect(`/campgrounds/${id}`);
  }))

  module.exports = router;