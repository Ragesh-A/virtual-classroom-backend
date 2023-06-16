const announcementService = require('../services/announcementService');
const announcementValidation = require('../validations/validation');

exports.createAnnouncement = async (req, res) => {
  try {
    const { error, value } = announcementValidation.announcementData.validate(req.body);
    if (error) throw new Error(error.details[0].message);
    const { _id } = req.user;
    const announcement = await announcementService.createAnnouncement(_id, value);
    res.json({ success: { announcement } });
  } catch (error) {
    res.json({ error: error.message });
  }
};

exports.getClassAnnouncements = async (req, res) => {
  try {
    const { classId } = req.params;
    const announcements = await announcementService.getAnnouncementsByClass(classId);
    res.json({ success: { announcements } });
  } catch (error) {
    res.json({ error: error.message });
  }
};

exports.getAnnouncements = async (req, res) => {
  try {
    const { by, value } = req.query;
    const { _id } = req.user;
    let announcements;
    switch (by) {
      case 'user': announcements = await announcementService.getAnnouncementsByUser(_id); break;
      case 'class': announcements = await announcementService.getAnnouncementsByClass(value); break;
      default: announcements = [];
    }
    res.json({ success: { announcements } });
  } catch (error) {
    console.log(error);
    res.json({ error: error.message });
  }
};
