/* eslint-disable no-underscore-dangle */
// eslint-disable-next-line import/no-extraneous-dependencies
const shortid = require('shortid');
const { v4: uuid } = require('uuid');

exports.filterUserData = (user) => {
  const filteredData = { ...user };
  delete filteredData._doc.password;
  return filteredData._doc;
};

exports.generateUid = () => uuid();

exports.generateId = () => shortid.generate();

exports.filterClass = (enrolledList) => {
  const filteredEnrolledList = enrolledList.map((enrolled) => enrolled.classId);
  return filteredEnrolledList;
};
