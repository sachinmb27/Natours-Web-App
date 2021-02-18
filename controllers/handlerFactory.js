const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const APIFeatures = require('./../utils/apiFeatures');

exports.deleteOne = Model => catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndDelete(req.params.id);
  
    if (!doc) {
      return next(new AppError('No document found with that ID', 404));
    }
  
    res.status(204).json({
      status: 'success',
      data: null
    });
});

exports.updateOne = Model => catchAsync(async (req, res, next) => {
  const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  if (!doc) {
    return next(new AppError('No document found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      data: doc
    }
  });
});

exports.createOne = Model => catchAsync(async (req, res, next) => {
  const newDoc = await Model.create(req.body);

  res.status(201).json({
    status: 'success',
    data: {
      data: newDoc
    }
  });
});

exports.getOne = (Model, populateOptions) => catchAsync(async (req, res, next) => {
  let query = Model.findById(req.params.id);
  
  if(populateOptions) query = query.populate(populateOptions);
  const docs = await query;
  
  if (!docs) {
    return next(new AppError('No documents found', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      docs
    }
  });
});

exports.getAll = Model => catchAsync(async (req, res, next) => {
  // To allow for nested GET reviews on Tour
  let filterObj = {};
  if(req.params.tourId) filterObj = { tour: req.params.tourId };

  const features = new APIFeatures(Model.find(filterObj), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();
  // const docs = await features.query.explain();
  const docs = await features.query;

  // SEND RESPONSE
  res.status(200).json({
    status: 'success',
    results: docs.length,
    data: {
      docs
    }
  });
});