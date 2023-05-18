const Class = require('../services/classes');

exports.userAllClasses = async (req, res) => {
  try {
    const { _id } = req.user;
    const classes = await Class.getAllUserClasses(_id);
    res.json({ success: classes });
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

const retrieval = false;
