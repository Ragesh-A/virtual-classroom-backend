const analyticsServices = require('../services/analyticsServices');

exports.adminDashboard = async (req, res) => {
  try {
    const data = await analyticsServices.adminDashboard();
    res.json({ success: { data } });
  } catch (error) {
    res.json({ error: error.message });
  }
};

exports.organizationDashboard = async (req, res) => {
  try {
    const { _id } = req.user;
    const data = await analyticsServices.organizationDashboard(_id);
    res.json({ success: { data } });
  } catch (error) {
    res.json({ error: error.message });
  }
};

exports.classDashboard = async (req, res) => {
  try {
    const { classId } = req.query;
    const data = await analyticsServices.classDashboard(classId);
    res.json({ success: { data } });
  } catch (error) {
    res.json({ error: error.message });
  }
};
