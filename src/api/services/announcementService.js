const Announcement = require('../models/announcement');
const classService = require('./classes');

exports.getAnnouncementsByClass = async (classId) => {
  const today = new Date().toISOString().split('T')[0];
  return Announcement.find({ classes: classId, announceAt: today });
};

exports.getAnnouncementsByUser = async (user) => {
  let classes = await classService.getAllUserClasses(user);
  classes = classes.map(({ _id }) => _id);
  const today = new Date().toISOString().toString().split('T')[0];
  const announcements = await Announcement.aggregate([
    { $match: { classes: { $in: classes }, announceAt: today } },
    { $unwind: '$classes' },
    {
      $lookup: {
        from: 'classes', localField: 'classes', foreignField: '_id', as: 'class',
      },
    },
  ]);
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
  const announcement = await Announcement.findOne({ _id }).populate('classes');
  if (!announcement) throw new Error('No such announcements');
  return announcement;
};

exports.updateAnnouncement = async (payload) => {
  const isUpdated = await Announcement.updateOne(payload);
  return isUpdated;
};

exports.getAllClassAnnouncements = async (classId) => {
  const today = new Date();
  today.setUTCHours(0, 0, 0, 0);
  const threeDaysAgo = new Date(today);
  threeDaysAgo.setDate(today.getDate() - 3);
  const deleteQuery = { classes: classId, announceAt: { $lt: threeDaysAgo.toISOString().split('T')[0] } };
  await Announcement.deleteMany(deleteQuery);
  const allAnnouncements = await Announcement.find({ classes: classId });
  return allAnnouncements;
};

exports.deleteAnnouncement = async (announcementId) => {
  await Announcement.deleteOne({ _id: announcementId });
  return true;
};

exports.getAnnouncementsByOrganization = async (userId) => {
  const classes = await classService.findAllCreatedClass(userId);
  const classIds = classes.map(({ _id }) => _id);
  const allAnnouncements = await Announcement.find(
    { classes: { $in: classIds } },
  ).populate('classes');
  return allAnnouncements;
};
