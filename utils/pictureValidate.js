const pictureValidate = async (picture) => {
  if (Array.isArray(picture)) {
    return { error: "Upload a single image only." };
  }
  if (picture.size > 1048576) {
    return { error: "File size is too large" };
  }

  const mimeType = picture.mimetype;

  const fileType = /jpg|jpeg|png/;

  const typeTest = fileType.test(mimeType);
  if (!typeTest) {
    return {
      error: "Invalid picture format (only jpg, jpeg, png types allowed)",
    };
  }

  return { error: false };
};

module.exports = { pictureValidate };
