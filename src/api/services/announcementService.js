const Announcement = require('../models/announcement');
const classService = require('./classes');

exports.getAnnouncementsByClass = async (classId) => Announcement.find({ classes: classId });

exports.getAnnouncementsByUser = async (user) => {
  let classes = await classService.getAllUserClasses(user);
  classes = classes.map(({ _id }) => _id);
  const announcements = await Announcement.find({ classes: { $in: classes } });
  return announcements;
};

exports.createAnnouncement = async (user, data) => {
  const newAnnouncement = new Announcement({
    title: data.title,
    description: data.description,
    classes: data.classes,
    icon: data.icon,
    announceAt: data.announceAt.toISOString().toString().split('T')[0],
    theme: data.theme,
    action: data.action,
    createdBy: user,
  });
  await newAnnouncement.save();
  return newAnnouncement;
};
