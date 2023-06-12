const path = require('path');
const fs = require('fs');
const multer = require('multer');
const sharp = require('sharp');

const classDestination = path.join(__dirname, '../../public/images/classroom');
const profileDestination = path.join(__dirname, '../../public/images/profiles');
const assignmentDestination = path.join(__dirname, '../../public/images/assignments');
const submissionsDestination = path.join(__dirname, '../public/images/submissions');

const classImageStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, classDestination);
  },
  filename: (req, file, cb) => {
    const extension = file.originalname.split('.').pop();
    cb(null, `${req.body.name}-${req.body.section}-${Date.now()}.${extension}`);
  },
});

const profileImageStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, profileDestination);
  },
  filename: (req, file, cb) => {
    const { _id } = req.user;
    const extension = file.originalname.split('.').pop();
    cb(null, `${_id}.${extension}`);
  },
});

const assignmentStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, assignmentDestination);
  },
  filename: (req, file, cb) => {
    const extension = file.originalname.split('.').pop();
    cb(null, `${req.body.classId}-${req.body.title.replace(/\s/g, '')}.${extension}`);
  },
});

const submissionStorage = multer.diskStorage({
  destination: (req, files, cb) => {
    cb(null, submissionsDestination);
  },
  filename: (req, file, cb) => {
    console.log(file);
    const currentDate = new Date();
    const timestamp = currentDate.getTime();
    const originalName = file.originalname;
    const extension = originalName.substr(originalName.lastIndexOf('.'));
    const fileName = `${timestamp}${extension}`;
    cb(null, fileName);
  },
});

const classImageResize = async (req, res, next) => {
  if (!req.file) return next();
  const fileBuffer = fs.readFileSync(req.file.path);
  try {
    await sharp(fileBuffer)
      .resize(500, 200)
      .toFormat('webp')
      .webp({ quality: 80 })
      .toFile(req.file.path, { ext: 'webp' });

    next();
    return true;
  } catch (error) {
    return false;
  }
};

const profileResize = async (req, res, next) => {
  if (!req.file) return next();
  const fileBuffer = fs.readFileSync(req.file.path);

  try {
    await sharp(fileBuffer)
      .resize(250, 250)
      .webp({ quality: 80 })
      .toFile(req.file.path, { format: 'webp' });

    next();
    return true;
  } catch (error) {
    return false;
  }
};

const uploadClassBanner = multer({ storage: classImageStorage });
const uploadProfileImage = multer({ storage: profileImageStorage });
const uploadAssignmentImage = multer({ storage: assignmentStorage });
const uploadSubmissionImage = multer({ storage: submissionStorage, limits: { files: 5 } });

module.exports = {
  profileResize,
  uploadClassBanner,
  uploadProfileImage,
  classImageResize,
  uploadAssignmentImage,
  uploadSubmissionImage,
};