const services = require('../services/assignmentServices');

exports.create = async (req, res) => {
  try {
    const { _id } = req.user;
    let {
      // eslint-disable-next-line prefer-const
      classId, title, description, dueDate,
    } = req.body;
    if (typeof classId === 'string') {
      classId = [classId];
    }
    // eslint-disable-next-line max-len
    const assignment = await services.createAssignment(classId, title, description, dueDate, _id);
    res.json({ success: { assignment } });
  } catch (error) {
    res.json({ error: error.message });
  }
};

exports.findByClass = async (req, res) => {
  try {
    const { classId } = req.params;
    const assignments = await services.allAssignments(classId);
    res.json({ success: { assignments } });
  } catch (error) {
    res.json({ error: error.message });
  }
};

exports.getAssignment = async (req, res) => {
  try {
    const { assignmentId } = req.params;
    const assignment = await services.getAssignment(assignmentId);
    res.json({ success: { assignment } });
  } catch (error) {
    res.json({ error: error.message });
  }
};

exports.updateOne = async (req, res) => {
  try {
    const isUpdated = await services.update(req.body);
    res.json({ success: { isUpdated } });
  } catch (error) {
    res.json({ error: error.message });
  }
};

exports.createSubmission = async (req, res) => {
  try {
    const { assignmentId } = req.params;
    const { _id } = req.user;
    const { answer } = req.body;
    const isSubmitted = await services.createSubmission(_id, assignmentId, answer);
    res.json({ success: isSubmitted });
  } catch (error) {
    res.json({ error: error.message });
  }
};

exports.submissions = async (req, res) => {
  try {
    const { classId, assignmentId } = req.params;
    const submissions = await services.allSubmissions(classId, assignmentId);
    res.json({ success: { submissions } });
  } catch (error) {
    res.json({ error: error.message });
  }
};

exports.findOneSubmission = async (req, res) => {
  try {
    const { submissionId } = req.params;
    const submission = await services.findBySubmissionId(submissionId);
    res.json({ success: { submission } });
  } catch (error) {
    res.json({ error: error.message });
  }
};
