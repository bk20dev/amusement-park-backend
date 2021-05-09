const mongoReducer = (document) => {
  if ('_doc' in document) document = document._doc;

  const { _id: id, __v, ...rest } = document;
  return { id, ...rest };
};

module.exports = mongoReducer;
