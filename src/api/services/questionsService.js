const QuestionsModel = require('../models/questions');
const SubmissionModel = require('../models/submissionModel');

exports.create = async (userId, classId, title, description, questions, dueDate) => {
  const date = new Date(dueDate);
  const formatted = date.toISOString().split('T')[0];
  const newQuestions = new QuestionsModel({
    createdBy: userId,
    class: classId,
    title,
    description,
    questions,
    date: formatted,
  });
  await newQuestions.save();
  return newQuestions;
};

exports.allClassQuestions = async (classId) => {
  if (!classId) throw new Error('Missing query');
  return QuestionsModel.find({ class: classId }).sort({ createdAt: 1 });
};

exports.getQuestion = async (questionId) => {
  const question = await QuestionsModel.findById(questionId);
  if (!question) throw new Error('No such Question found!');
  return question;
};

exports.submitAnswer = async (questionId, student, answer, timeTaken) => {
  if (!answer) throw new Error('Submission not possible without answer');
  const isSubmitted = await SubmissionModel.findOne({ assignmentId: questionId, student });
  if (isSubmitted) throw new Error('user already submitted');
  const stringifiedAnswer = JSON.stringify(answer);
  const newSubmission = new SubmissionModel({
    assignmentId: questionId,
    student,
    answer: stringifiedAnswer,
    timeTaken,
  });
  await newSubmission.save();
  const parsedAnswer = JSON.parse(newSubmission.answer);
  newSubmission.answer = parsedAnswer;
  return { ...newSubmission.toObject(), answer: parsedAnswer };
};

exports.getSubmission = async (assignmentId) => {
  const submission = await SubmissionModel.findById(assignmentId);
  if (!submission) throw new Error('No such submission found');
  return submission;
};

exports.isSubmitted = async (userId, questionId) => {
  const submission = await SubmissionModel.findOne({ assignmentId: questionId, student: userId });
  if (submission) return true;
  return false;
};
