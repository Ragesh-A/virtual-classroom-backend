const QuestionSubmission = require('../models/QuestionSubmission');
const QuestionsModel = require('../models/questions');
const SubmissionModel = require('../models/submissionModel');

exports.create = async (
  userId,
  classId,
  title,
  description,
  questions,
  dueDate,
  startTime,
  endTime,
  type,
) => {
  const date = new Date(dueDate);
  const formatted = date.toISOString().split('T')[0];
  const newQuestions = new QuestionsModel({
    createdBy: userId,
    class: classId,
    title,
    description,
    questions,
    date: formatted,
    startTime,
    endTime,
    type,
  });
  await newQuestions.save();
  return newQuestions;
};

exports.allClassQuestions = async (classId) => {
  if (!classId) throw new Error('Missing query');
  return QuestionsModel.find({ class: classId }).sort({ createdAt: -1 });
};

exports.getQuestion = async (questionId) => {
  const question = await QuestionsModel.findById(questionId);
  if (!question) throw new Error('No such Question found!');
  return question;
};

exports.submitAnswer = async (questionId, student, answer, timeTaken) => {
  if (!answer) throw new Error('Submission not possible without answer');
  if (!questionId) throw new Error('Question is is missing')
  const isSubmitted = await QuestionSubmission.findOne({
    question: questionId, student
  });

  if (isSubmitted) throw new Error('user already submitted');
  
  const newSubmission = new QuestionSubmission({
   question: questionId,
   student,
   answer,
   timeTaken
  });

  await newSubmission.save();
  
  return newSubmission;
};

exports.getSubmission = async (assignmentId) => {
  const submission = await SubmissionModel.findById(assignmentId);
  if (!submission) throw new Error('No such submission found');
  return submission;
};

exports.isSubmitted = async (userId, questionId) => {
  const submission = await QuestionSubmission.findOne({
    question: questionId,
    student: userId,
  });
  if (submission) return true;
  return false;
};

exports.allCreatedQuestion = async (user) => {
  const questions = await QuestionsModel.find({ createdBy: user })
    .populate('class')
    .sort({ createdAt: -1 });
  return questions;
};

exports.getQuestionSubmissions = async (questionId) => {
  const submissions = await QuestionSubmission.find({ question: questionId })
    .populate('question').populate('student', '-password -isAdmin');
  console.log(submissions);
  return submissions;
}