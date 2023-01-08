const { validationResult } = require('express-validator');

const validate = (validations) => {
  return async (req, res, next) => {
    for (let validation of validations) {
      const result = await validation.run(req);
    }

    const errors = validationResult(req);
    let tmp = [];
    let errs = errors.array().filter((error) => {
      if (tmp.includes(error.param)) {
        return false;
      }
      tmp.push(error.param);
      return true;
    });

    if (errors.isEmpty()) {
      return next();
    }

    return res.status(400).json({
      success: false,
      error: 'Validation Failed',
      errs,
    });
  };
};

module.exports = {
  validate,
};
