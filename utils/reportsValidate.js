const reportsValidate = async (reports) => {
  let reportsTable = [];
  if (Array.isArray(reports)) {
    reportsTable = reports;
  } else {
    reportsTable.push(reports);
  }
  for (let report of reportsTable) {
    if (report.size > 1048576) {
      return { error: "File size is to large" };
    }
  }
  return { error: false };
};
module.exports = { reportsValidate };
