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
      case 'organization': announcements = await announcementService.getAnnouncementsByOrganization(_id); break;
      default: announcements = [];
    }
    res.json({ success: { announcements } });
  } catch (error) {
    res.json({ error: error.message });
  }
};

exports.getAllClassAnnouncements = async (req, res) => {
  try {
    const { classId } = req.params;
    const announcements = await announcementService.getAllClassAnnouncements(classId);
    res.json({ success: { announcements } });
  } catch (error) {
    res.json({ error: error.message });
  }
};

exports.allAnnouncements = async (req, res) => {
  try {
    const { _id } = req.para;
    const announcements = await announcementService.allAnnouncements(_id);
    res.json({ success: { announcements } });
  } catch (error) {
    res.json({ error: error.message });
  }
};

exports.getAnnouncement = async (req, res) => {
  try {
    const { announcementId } = req.params;
    const announcement = await announcementService.getAnnouncement(announcementId);
    res.json({ success: { announcement } });
  } catch (error) {
    res.json({ error: error.message });
  }
};

exports.updateAnnouncement = async (req, res) => {
  try {
    const announcement = await announcementService.updateAnnouncement(req.body);
    res.json({ success: { announcement } });
  } catch (error) {
    res.json({ error: error.message });
  }
};

exports.deleteAnnouncement = async (req, res) => {
  try {
    const { announcementId } = req.params;
    const isDeleted = await announcementService.deleteAnnouncement(announcementId);
    res.json({ success: isDeleted });
  } catch (error) {
    res.json({ error: error.message });
  }
};
