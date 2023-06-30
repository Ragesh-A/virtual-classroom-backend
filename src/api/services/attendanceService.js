const Attendance = require('../models/attendance');

exports.getAttendance = async (classId) => {
  const today = new Date();
  const formattedToday = today?.toISOString().split('T')[0];
  const attendance = await Attendance.findOne({ class: classId, createdAt: formattedToday }).populate('students.student');
  return attendance;
};

exports.takeAttendance = async (classId, payload) => {
  const today = new Date();
  const formattedToday = today?.toISOString().split('T')[0];
  const filteredPayload = payload.map(({ _id, status }) => ({ student: _id, status }));
  const isTaken = await Attendance.findOne({ class: classId, createdAt: formattedToday });

  if (isTaken) {
    await Attendance.updateOne(
      { class: classId, createdAt: formattedToday },
      { students: filteredPayload },
    );
    return { message: 'Attendance updated' };
  }
  const newAttendance = new Attendance({
    class: classId,
    students: filteredPayload,
    createdAt: formattedToday,
  });
  await newAttendance.save();
  return { message: 'Attendance taken successfully' };
};

exports.getAttendances = async (classId) => {
  const attendances = await Attendance.find({ class: classId });
  if (!attendances) return [];
  return attendances;
};
