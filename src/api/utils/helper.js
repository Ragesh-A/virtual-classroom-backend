/* eslint-disable no-underscore-dangle */
// eslint-disable-next-line import/no-extraneous-dependencies
const { v4: uuid } = require('uuid');

exports.filterUserData = (user) => {
  const filteredData = { ...user };
  delete filteredData._doc.password;
  return filteredData._doc;
};

exports.generateUid = () => uuid();
