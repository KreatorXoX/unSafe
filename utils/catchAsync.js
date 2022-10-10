module.exports = (func) => {
  return (req, res, next) => {
    func(req, res, next).catch(next);
  };
}; // we dont want to add try catch to every async route so
// its better to make a helper function to wrap around our async routes.
