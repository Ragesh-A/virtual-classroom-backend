const questionsServices = require('../services/questionsService');

exports.create = async (req, res) => {
  try {
    const {
      classId, title, description, questions, date, startTime, endTime, type,
    } = req.body;
    const { _id } = req.user;
    const newQuestion = await questionsServices
      .create(_id, classId, title, description, questions, date, startTime, endTime, type);
    res.status(201).json({ success: { newQuestion } });
  } catch (error) {
    res.json({ error: error.message });
  }
};

exports.getClassQuestions = async (req, res) => {
  try {
    const { classId } = req.query;
    const questions = (await questionsServices.allClassQuestions(classId));
    res.status(200).json({ success: { questions } });
  } catch (error) {
    res.json({ error: error.message });
  }
};

exports.getQuestion = async (req, res) => {
  try {
    const { questionId } = req.params;
    const question = await questionsServices.getQuestion(questionId);
    res.status(200).json({ success: { question } });
  } catch (error) {
    res.json({ error: error.message });
  }
};

exports.createSubmission = async (req, res) => {
  try {
    const { questionId } = req.params;
    const { _id } = req.user;
    const { answers, timeTaken } = req.body;
    const submission = await questionsServices.submitAnswer(questionId, _id, answers, timeTaken);
    res.status(201).json({ success: { submission } });
  } catch (error) {
    res.json({ error: error.message });
  }
};

exports.getSubmission = async (req, res) => {
  try {
    const { submissionId } = req.params;
    const submission = await questionsServices.getSubmission(submissionId);
    res.status(200).json({ success: { submission } });
  } catch (error) {
    res.json({ error: error.message });
  }
};

exports.updateSubmission = async (req, res) => {
  try {
    const { submissionId } = req.params;
    const payload = req.body;
    const submission = await questionsServices.updateSubmission(submissionId, payload);
    res.status(200).json({ success: { submission } });
  } catch (error) {
    res.json({ error: error.message });
  }
};

exports.isSubmitted = async (req, res) => {
  try {
    const { _id } = req.user;
    const { questionId } = req.params;
    const isSubmitted = await questionsServices.isSubmitted(_id, questionId);
    res.status(200).json({ success: { isSubmitted } });
  } catch (error) {
    res.json({});
  }
};

exports.questUserCreatedQuestion = async (req, res) => {
  try {
    const { _id } = req.user;
    const questions = await questionsServices.allCreatedQuestion(_id);
    res.status(200).json({ success: { questions } });
  } catch (error) {
    res.json({ error: error.message });
  }
};
