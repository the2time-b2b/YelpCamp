const express = require('express');
const multer = require('multer');

const catchAsync = require('../utils/catchAsync');
const {
    validateCampground,
    checkAuthentication,
    checkCampAuth
} = require('../utils/middlewares')
const campgrounds = require('../controllers/campgrounds');
const { storage } = require('../cloudinary');


const router = express.Router();
const upload = multer({ storage });


router.route('/')
    .get(catchAsync(campgrounds.listCampgrounds))
    .post
    (
        checkAuthentication,
        upload.array('image'), // comes after validateCampground when in production
        validateCampground,
        catchAsync(campgrounds.createCampground)
    );


router.get('/new', checkAuthentication, campgrounds.renderNewForm);


router.route('/:id')
    .get(catchAsync(campgrounds.showCampground))
    .put
    (
        checkAuthentication,
        checkCampAuth,
        upload.array('image'), // comes after validateCampground when in production
        validateCampground,
        catchAsync(campgrounds.editCampground)
    )
    .delete
    (
        checkAuthentication,
        checkCampAuth,
        catchAsync(campgrounds.deleteCampground)
    );


router.get
    (
        '/:id/edit',
        checkAuthentication,
        checkCampAuth,
        catchAsync(campgrounds.renderEditForm)
    );


// Exports the routes for campgrounds specific paths to app.js 
module.exports = router;