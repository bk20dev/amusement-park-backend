const attractionReducer = (attraction) => {
  const { _id: id, __v, ...rest } = attraction;
  return { id, ...rest };
};

module.exports = attractionReducer;
