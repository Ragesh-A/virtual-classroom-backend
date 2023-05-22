const Class = require('../services/classes');
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
    res.json({ success: classes });
  } catch (error) {
    res.json({ error: error.message });
  }
};

exports.getClass = async (req, res) => {
  try {
    const { classId } = req.params;
    const singleClass = await Class.findOne(classId);
    res.json({ success: singleClass });
  } catch (error) {
    res.json({ error: error.message });
  }
};

exports.updateClass = async (req, res) => {
  try {
    const { classId } = req.params;
    const { value, error } = classUpdateSchema.validate(req.body);
    if (error) throw new Error(error.details[0].message);
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
    const newClass = await Class.create(value, _id);
    res.json({ success: newClass });
  } catch (error) {
    res.json({ error: error.message });
  }
};
