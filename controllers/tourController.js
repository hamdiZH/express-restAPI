const Tour = require("./../models/tourModel");

exports.getAllTours = async (req, res) => {
    try {
        console.log(req.query);
        // Build QUERY
        // 1) Filtering
        const queryObj = { ...req.query };
        const excludedFields = ['page', 'sort', 'limit', 'fields'];
        // Using forEach because I don't need to save a new array
        excludedFields.forEach(el => delete queryObj[el]);

        // 2) Advanced filtering
        let queryStr = JSON.stringify(queryObj);
        queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}` );
        console.log(JSON.parse(queryStr));

        const query = Tour.find(JSON.parse(queryStr));


        // EXECUTE QUERy
        const tours = await query;
        // const query = Tour.find()
        //     .where("duration").equals(5)
        //     .where("difficulty").equals("easy");
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
        res.status(400).json({
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
