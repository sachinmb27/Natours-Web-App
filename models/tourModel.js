const mongoose = require('mongoose');
const slugify = require('slugify');
const validator = require('validator');

// Scheme for Tour collection
const tourScheme = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'A tour must have a name'],
        unique: true,
        trim: true,
        maxlength: [40, 'A tour name must have less or equal than 40 characters'],
        minlength: [10, 'A tour name must have more or equal than 10 characters'],
        // validate: [validator.isAlpha, 'Tour name must only contain characters']
    },
    slug: String,
    duration: {
        type: Number,
        required: [true, 'A tour must have a duration']
    },
    maxGroupSize: {
        type: Number,
        required: [true, 'A tour must have agroup size']
    },
    difficulty: {
        type: String,
        required: [true, 'A tour must have a difficulty'],
        enum: {
            values: ['easy', 'medium', 'difficult'],
            message: 'Difficulty is either: easy, medium or difficult'
        }
    },
    ratingsAverage: {
        type: Number,
        default: 4.5,
        min: [1, 'Rating must be above 1.0'],
        max: [5, 'Rating must be below 5.0']
    },
    ratingsQuantity: {
        type: Number,
        default: 0
    },
    price: {
        type: Number,
        required: [true, 'A tour must have a price']
    },
    priceDiscount: {
        type: Number,
        validate: {
            validator: function(val) {
                // this only points to current doc on NEW document creation
                return val < this.price;
            },
            message: 'Discount price should be below regular price'
        }
    },
    summary: {
        type: String,
        trim: true,
        required: [true, 'A tour must have a summary']
    },
    description: {
        type: String,
        trim: true
    },
    imageCover: {
        type: String,
        required: [true, 'A tour must have a cover image']
    },
    images: [String],
    createdAt: {
        type: Date,
        default: Date.now(),
        select: false
    },
    startDates: [Date],
    secretTour: {
        type: Boolean,
        default: false
    }
}, {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Virtual function that only works after data is fetched from DB
// DurationWeeks is not stored in DB as it is virtual, but shown in the API output
tourScheme.virtual('durationWeeks').get(function() {
    return this.duration / 7;
});

// DOCUMENT MIDDLEWARE: runs before .save() and .create()
tourScheme.pre('save', function(next) {
    this.slug = slugify(this.name, { lower: true });
    next();
});

// tourScheme.pre('save', function(next) {
//     console.log('Will save document...');
//     next();
// });

// tourScheme.post('save', function(doc, next) {
//     console.log(doc);
//     next();
// })

// QUERY MIDDLEWARE
// tourScheme.pre('find', function(next) {
tourScheme.pre(/^find/, function(next) {
    this.find({ secretTour: { $ne: true } });
    this.start = Date.now();
    next();
});

tourScheme.post(/^find/, function(docs, next) {
    console.log(`Query took ${Date.now() - this.start} milliseconds!`);
    console.log(docs);
    next();
});

// AGGREGATION MIDDLEWARE
tourScheme.pre('aggregate', function(next) {
    this.pipeline().unshift({ $match: { secretTour: { $ne: true } } });
    console.log(this.pipeline());
    next();
});

// Model created for Tour using the Tour schema
const Tour = mongoose.model('Tour', tourScheme);

module.exports = Tour;
