class APIFeatures {
    // parsing 2-variables her:
    // 1) mongoose query
    // 2) queryString that we get from express, basically coming from the route. that's what we usually have access to the req.query
    constructor(query, queryString) {
        this.query = query;
        this.queryString = queryString;
    }

    // create one method for each og the functionality
    // 1) filter
    filter() {
        const queryObj = { ...this.queryString };
        const excludedFields = ["page", "sort", "limit", "fields"];
        // Using forEach because I don't need to save a new array
        excludedFields.forEach(el => delete queryObj[el]);

        // 1B) Advanced filtering
        let queryStr = JSON.stringify(queryObj);
        queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);
        console.log(JSON.parse(queryStr));

        this.query = this.query.find(JSON.parse(queryStr));
        // let query = Tour.find(JSON.parse(queryStr));

        return this;
    }

    // 2) Sorting
    sorting() {
        if (this.queryString.sort) {
            const sortBy = this.queryString.sort.split(",").join(" ");
            console.log(sortBy);
            this.query = this.query.sort(sortBy);
        } else {
            this.query = this.query.sort("-createdAt");
        }

        // return the entire object which has access to these other methods
        return this;
    }

    // 3) Limiting
    limiting() {
        if (this.queryString.fields) {
            const fields = this.queryString.fields.split(',').join(' ');
            this.query = this.query.select(fields)
        } else {
            // -: means not include, except every thing except V field
            this.query = this.query.select('-__v')
        }

        return this;
    }

    // 4) Pagination
    paginate() {
        const page = this.queryString.page * 1 || 1;
        const limit = this.queryString.limit * 1 || 100;
        // Calculate the skipp value
        // (page - 1): previous page
        // ?page=2 => skip = (2 - 1) * 10 = 10 => skip(10)
        const skip = (page - 1) * limit;
        this.query = this.query.skip(skip).limit(limit);

        return this;
    }
}

module.exports = APIFeatures;