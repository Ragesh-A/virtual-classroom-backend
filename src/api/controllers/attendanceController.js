const service = require('../services/attendanceService');

exports.todayAttendance = async (req, res) => {
  try {
    const { classId } = req.params;
    const attendance = await service.getAttendance(classId);
    res.json({ success: { attendance } });
  } catch (error) {
    res.json({ error: { error } });
  }
};

exports.createAttendance = async (req, res) => {
  try {
    const { classId } = req.params;
    const { attendance } = req.body;
    const isCreated = await service.takeAttendance(classId, attendance);
    res.json({ success: isCreated });
  } catch (error) {
    res.json({ error: { error } });
  }
};

exports.getAttendances = async (req, res) => {
  try {
    const { classId } = req.params;
    const attendances = await service.getAttendances(classId);
    res.json({ success: { attendances } });
  } catch (error) {
    res.json({ error: error.message });
  }
};
