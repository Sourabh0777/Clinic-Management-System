const Prescription = require('../../Models/PrescriptionModel');
const HttpError = require('../../Models/http-error');
const { uploadPrescriptionPath } = require('../../config/config');

const getPrescriptions = async (req, res, next) => {
  try {
    const userId = req.body.userId;
    const prescriptions = await Prescription.find({ user: userId }).orFail();
    return res.json({ message: 'Success', prescriptions });
  } catch (error) {
    const err = new HttpError('Unable to find prescriptions', 500);
    return next(error || err);
  }
};
const uploadPrescription = async (req, res, next) => {
  const uploadPrescriptionDirectory = path.resolve(
    __dirname,
    uploadPrescriptionPath,
  );
  try {
    const { user, doctor, typename, createdDate } = req.body;
    if (!typename) {
      const err = new HttpError('*Report Type Required', 400);
      next(err);
    }
    const labReport = new Prescription({
      user,
      doctor,
      typename,
      createdDate,
    });

    const reports = req.files.reports;
    if (!req.files || !!reports === false) {
      const err = new HttpError('No files attached', 400);
      return next(err);
    }
    const validateResult = reportsValidate(reports);
    if (validateResult.error) {
      const err = new HttpError(validateResult.error, 400);
      return next(err);
    }

    let reportTable = [];
    if (Array.isArray(reports)) {
      reportTable = reports;
    } else reportTable.push(reports);
    for (let report of reportTable) {
      const reportUniqueID = uuidv4();
      const extension = path.extname(report.name);
      const reportName = reportUniqueID + extension;
      const uploadPath = uploadPrescriptionDirectory + '/' + reportName;
      const fileUrl = '/lab/report/' + reportName;
      labReport.url.push(fileUrl);
      report.mv(uploadPath, function (err) {
        if (err) {
          const err = new HttpError('Unable to upload reports', 500);
          return next(err);
        }
      });
    }
    await labReport.save();
    res.json({ message: 'File Uploaded', labReport });
  } catch (error) {
    console.log(error);
    const err = new HttpError('Unable to upload reports', 500);
    return next(error || err);
  }
};

module.exports = { getPrescriptions, uploadPrescription };
