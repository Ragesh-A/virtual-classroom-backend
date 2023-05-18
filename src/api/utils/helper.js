/* eslint-disable no-underscore-dangle */
exports.filterUserData = (user) => {
  const filteredData = { ...user };
  delete filteredData._doc.password;
  return filteredData._doc;
};
