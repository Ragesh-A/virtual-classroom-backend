const Class = require('../services/classes');
const { getUser } = require('../services/user');
const { classUpdateSchema, classSchema } = require('../validations/validation');

exports.userAllClasses = async (req, res) => {
  try {
    const { _id } = req.user;
    const classes = await Class.getAllUserClasses(_id);
    res.json({ success: { classes } });
  } catch (error) {
    res.json({ error: error.message });
  }
};

exports.getAllClasses = async (req, res) => {
  try {
    const classes = await Class.allClasses();
    res.json({ success: { classes } });
  } catch (error) {
    res.json({ error: error.message });
  }
};

exports.getClass = async (req, res) => {
  try {
    const { classId } = req.params;
    const singleClass = await Class.findOne(classId);
    res.json({ success: { class: singleClass } });
  } catch (error) {
    res.json({ error: 'no class found' });
  }
};

exports.updateClass = async (req, res) => {
  try {
    const { classId } = req.params;
    const { value, error } = classUpdateSchema.validate(req.body);
    if (error) throw new Error(error.details[0].message);
    if (!value.instructor) {
      delete value.instructor;
    }
    const updatedClass = await Class.updateOne(classId, value);
    res.json({ success: updatedClass });
  } catch (error) {
    res.json({ error: error.message });
  }
};

exports.createClass = async (req, res) => {
  try {
    const { value, error } = classSchema.validate(req.body);
    if (error) throw new Error(error.details[0].message);
    const { _id } = req.user;
    const user = await getUser(_id);
    const newClass = await Class.create(value, user, req?.file?.filename);
    res.json({ success: newClass });
  } catch (error) {
    res.json({ error: error.message });
  }
};

exports.joinClass = async (req, res) => {
  try {
    const { _id } = req.user;
    const { uuid } = req.body;
    const isJoined = await Class.addIntoClass(_id, uuid);
    res.json({ success: isJoined });
  } catch (error) {
    res.json({ error: error.message });
  }
};

exports.requestToClass = async (req, res) => {
  try {
    const { _id } = req.user;
    const { uuid } = req.body;
    const isRequested = await Class.joinRequest(_id, uuid);
    res.json({ success: isRequested });
  } catch (error) {
    res.json({ error: error.message });
  }
};

exports.acceptJoinRequest = async (req, res) => {
  try {
    const { _id } = req.user;
    const { classId, studentId } = req.body;
    const isAccepted = await Class.acceptRequest(_id, classId, studentId);
    res.json({ success: isAccepted });
  } catch (error) {
    res.json({ error: error.message });
  }
};

exports.rejectJoinRequest = async (req, res) => {
  try {
    const { class: classId, student: studentId } = req.query;
    const isRejected = await Class.rejectRequest(classId, studentId);
    res.json({ success: isRejected });
  } catch (error) {
    res.json({ error: error.message });
  }
};

exports.students = async (req, res) => {
  try {
    const { classId } = req.params;
    const { _id: userId } = req.user;
    const students = await Class.getStudents(classId, userId);
    res.json({ success: students });
  } catch (error) {
    res.json({ error: 'no class found' });
  }
};

exports.removeStudent = async (req, res) => {
  try {
    const { student: studentId } = req.query;
    const { classId } = req.params;
    const isRemoved = await Class.removeFromClass(classId, studentId);
    res.json({ success: isRemoved });
  } catch (error) {
    res.json({ error: error.message });
  }
};

exports.allCreatedClasses = async (req, res) => {
  try {
    const { _id } = req.user;
    const classes = await Class.findAllCreatedClass(_id);
    res.json({ success: { classes } });
  } catch (error) {
    res.json({ error: error.message });
  }
};

exports.blockOrUnblock = async (req, res) => {
  try {
    const { classId } = req.body;
    const isBlocked = await Class.blockOrUnblock(classId);
    res.json({ success: { isBlocked } });
  } catch (error) {
    res.json({ error: error.message });
  }
};
