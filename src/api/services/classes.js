const Classes = require('../models/class');
const Enrolment = require('../models/classEnrollment');
const { generateId, filterClass } = require('../utils/helper');
const classHelper = require('../utils/classHelper');
const ClassWaitingList = require('../models/classWaitingList');

exports.getAllUserClasses = async (userId) => {
  const enrolledClassesPromise = async () => Enrolment.find(
    { students: { $in: [userId] } },
  ).populate({
    path: 'classId',
    populate: { path: 'createdBy', select: '-password' },
  });
  const createdClassesPromise = async () => Classes.find(
    { $or: [{ createdBy: userId }, { instructor: userId }] },
  ).populate({ path: 'createdBy', select: '-password' });
  const [enrolledClassesResult, createdClassesResult] = await
  Promise.allSettled([
    enrolledClassesPromise(),
    createdClassesPromise(),
  ]);
  const filteredClass = filterClass(enrolledClassesResult.value);
  return [...filteredClass, ...createdClassesResult.value];
};

exports.allClasses = async () => {
  const classes = await Classes.find().populate({
    path: 'createdBy',
    select: '-password',
  });
  if (!classes) throw new Error('something went wrong');
  return classes;
};

exports.findOne = async (classId) => {
  const singleClass = await Classes.findOne({ _id: classId }).populate(
    'instructor',
  );
  let students = await Enrolment.findOne({ classId }).populate('students');
  if (!students) {
    students = [];
  } else {
    students = students.students;
  }
  return { class: singleClass, students };
};

exports.updateOne = async (classId, payload) => {
  const updatedClass = await Classes.updateOne({ _id: classId }, payload);
  return updatedClass;
};

exports.create = async (
  payload,
  { _id: createdBy, subscriber },
  image = '',
) => {
  if (!payload.instructor) {
    payload.instructor = createdBy;
  }
  const classCount = await Classes.find({ createdBy }).count();
  if (!subscriber && classCount >= 5) {
    throw new Error('limit exceeded needed to subscribe for more');
  }

  const uuid = generateId();
  const newClass = new Classes({
    ...payload,
    uuid,
    image,
    subscription: subscriber.status,
    createdBy,
  });
  await newClass.save();
  return newClass;
};

exports.joinRequest = async (userId, uuid) => {
  const singleClass = await Classes.findOne({ uuid });
  if (!singleClass) throw new Error('could not find the class');
  const { _id, createdBy, instructor } = singleClass;
  if (userId === createdBy.toString() || userId === instructor.toString()) {
    return { message: 'you are already in the class' };
  }
  const response = await classHelper.addIntoWaitingList(_id, userId);
  return response;
};

exports.acceptRequest = async (lectureId, classId, studentId) => {
  const isClassExist = await Classes.findOne({ _id: classId });
  if (!isClassExist) throw new Error('could not find the class');
  if (
    (isClassExist.createdBy.toString() !== lectureId)
    && isClassExist.instructor.toString() !== lectureId
  ) {
    throw new Error('unauthorized');
  }
  await classHelper.generateEnrollment(classId);
  const response = await classHelper.enrollStudent(classId, studentId);
  return response;
};

exports.rejectRequest = async (classId, studentId) => {
  const isRemoved = await ClassWaitingList.updateOne(
    { classId },
    { $pull: { waiting: studentId } },
  );
  if (!isRemoved) throw new Error('failed to remove');
  return { message: 'removed successfully' };
};

exports.getStudents = async (classId, userId) => {
  const singleClass = await Classes.findOne({ _id: classId });
  if (!singleClass) throw new Error('no class found');
  if (
    singleClass.createdBy.toString() !== userId
    && singleClass.lectureId !== userId
  ) {
    throw new Error('unauthorized');
  }
  const studentsPromise = Enrolment.findOne({ classId }).populate({
    path: 'students',
    select: '-password',
  });
  const requestPromise = ClassWaitingList.findOne({ classId }).populate({
    path: 'waiting',
    select: '-password',
  });
  let [enrolledStudents, requestingStudents] = await Promise.allSettled([
    studentsPromise,
    requestPromise,
  ]);
  if (!enrolledStudents.value) {
    enrolledStudents = [];
  }
  if (!requestingStudents.value) {
    requestingStudents = [];
  }
  enrolledStudents = enrolledStudents.value;
  requestingStudents = requestingStudents.value;

  return { enrolledStudents, requestingStudents };
};

exports.removeFromClass = async (classId, studentId) => {
  const isRemoved = await Enrolment.updateOne(
    { classId },
    { $pull: { students: studentId } },
  );
  if (!isRemoved) throw new Error('failed to remove the student');
  return { message: 'removed from the class' };
};

exports.findAllCreatedClass = async (createdBy) => {
  let allClasses = await Classes.find({ createdBy }).populate('instructor');
  if (!allClasses) allClasses = [];
  return allClasses;
};

exports.blockOrUnblock = async (_id) => {
  const isClass = await Classes.findOne({ _id });
  if (!isClass) throw new Error('class not found');
  const isUpdated = await Classes.updateOne(
    { _id },
    { $set: { isBlocked: !isClass.isBlocked } },
  );
  return isUpdated;
};

exports.classSubscription = async (createdBy, status = false) => {
  const isUpdated = Classes.updateMany(
    { createdBy },
    { $set: { subscription: status } },
  );
  return isUpdated;
};

exports.classesByUser = async (userId) => Enrolment.find({ students: userId }).populate('classId');
