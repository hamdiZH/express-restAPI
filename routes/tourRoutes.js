const express = require('express');
const tourController = require('./../controllers/tourController');

const router = express.Router();

// router.param('id', tourController.checkID);

// Create a checkBody middleware
// Check if body contains the name and price property
// If not send back 400 (bad request)
// Add it ro the post handler stack

// Making the API Better_Aliasing
router.route('/top-5-cheap').get(tourController.aliasTopTours, tourController.getAllTours)

router
  .route('/')
  .get(tourController.getAllTours)
  .post(tourController.createTour);

router
  .route('/:id')
  .get(tourController.getTourById)
  .patch(tourController.updateTour)
  .delete(tourController.deleteTour);

module.exports = router;
