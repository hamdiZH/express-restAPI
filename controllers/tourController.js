const Tour = require("./../models/tourModel");

exports.getAllTours = async (req, res) => {
    try {
        console.log(req.query);
        // Build QUERY
        // 1A) Filtering
        const queryObj = { ...req.query };
        const excludedFields = ['page', 'sort', 'limit', 'fields'];
        // Using forEach because I don't need to save a new array
        excludedFields.forEach(el => delete queryObj[el]);

        // 1B) Advanced filtering
        let queryStr = JSON.stringify(queryObj);
        queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}` );
        console.log(JSON.parse(queryStr));

        let query = Tour.find(JSON.parse(queryStr));

        // 2) Sorting
        if (req.query.sort){
            const sortBy = req.query.sort.split(',').join(' ');
            console.log(sortBy);
            query = query.sort(sortBy)
        } else {
            query = query.sort('-createdAt');
        }

        // 3) Field Limiting
        if (req.query.fields) {
            const fields = req.query.fields.split(',').join(' ');
            query = query.select(fields)
        } else {
            // -: means not include, except every thing except V field
            query = query.select('-__v')
        }

        // 4) Pagination
        //skip: the amount of results that should be skipped before actually querying data.
        // ?page=2&limit=10: 1 - 10 for page 1, 11 - 20 for page 2, 21 - 30 for page 3 ...
        // so we need to skip the first 10 results before we actually start page tow.
        // we need some way to calculating the skipped value
        // before we get started and calculating the skip value, we need to first get the page and the limit from the query string, and define some default value.
        // multiply by one (*1) to convert string to a number.
        // || 1 means that by default page = 1
        const page = req.query.page * 1 || 1;
        const limit = req.query.limit * 1 || 100;
        // Calculate the skipp value
        // (page - 1): previous page
        // ?page=2 => skip = (2 - 1) * 10 = 10 => skip(10)
        const skip = (page - 1) * limit;
        query = query.skip(skip).limit(limit);

        // We need to implement throw error each time the user selects a page that does not exist
        if (req.query.page) {
            const numTours = await Tour.countDocuments();
            // We use throw an error, because we are in a try block so it will then automatically and immediately move on the catch block
            if (skip >= numTours) throw new Error('This page does nt exist');
        }

        // EXECUTE QUERy
        const tours = await query;

        //SEND RESPONSE
        res.status(200).json({
            status: "success",
            results: tours.length,
            data: {
                // tours: tours
                tours
            }
        });
    } catch (err) {
        res.status(404).json({
            status: "fail",
            message: err
        });
    }

};

exports.getTourById = async (req, res) => {
    try {
        const tour = await Tour.findById(req.params.id);
        // Tour.findOne({_id: req.params.id});
        res.status(200).json({
            status: "success",
            data: {
                // tours: tours
                tour
            }
        });
    } catch (err) {
        res.status(400).json({
            status: "fail",
            message: err
        });
    }
};

exports.createTour = async (req, res) => {
    try {
        // const newTour = new Tour({})
        // newTour.save()
        const newTour = await Tour.create(req.body);

        res.status(201).json({
            status: "success",
            data: {
                tour: newTour
            }
        });
    } catch (err) {
        res.status(400).json({
            status: "fail",
            message: err
        });
    }
};

exports.updateTour = async (req, res) => {
    try {
        const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });
        res.status(200).json({
            status: "success",
            data: {
                tour
            }
        });
    } catch (err) {
        res.status(400).json({
            status: "fail",
            message: err
        });
    }

};

exports.deleteTour = async (req, res) => {
    try {
        await Tour.findByIdAndDelete(req.params.id);
        res.status(204).json({
            status: "success",
            data: null
        });
    } catch (err) {
        res.status(400).json({
            status: "fail",
            message: err
        });
    }
};
