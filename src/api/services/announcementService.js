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

exports.allAnnouncements = async (userId) => {
  const allClasses = await classService.getAllUserClasses(userId);
  if (!allClasses || allClasses.length < 1) return [];
  const classIds = allClasses.map(({ _id }) => _id);
  const announcements = await Announcement.find({ classes: { $in: classIds } })
    .populate('classes');
  if (!announcements) return [];
  return announcements;
};

exports.getAnnouncement = async (_id) => {
  console.log(_id);
  const announcement = await Announcement.findOne({ _id }).populate('classes');
  console.log(announcement);
  if (!announcement) throw new Error('No such announcements');
  return announcement;
};

exports.updateAnnouncement = async (payload) => {
  const isUpdated = await Announcement.updateOne(payload);
  return isUpdated;
};
