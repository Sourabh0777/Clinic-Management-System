const pictureValidate = async (picture) => {
  if (Array.isArray(picture)) {
    return { error: "Upload a single image only." };
  }
  const mimeType = picture.mimetype;
  console.log("🚀 ~ pictureValidate ~ mimeType:", mimeType)

  const fileType = /jpg|jpeg|png|/;

  const typeTest = fileType.test(mimeType);
  if (!typeTest) {
    return {
      error: "Invalid picture format (only jpg, jpeg, png types allowed)",
    };
  }

  return { error: false };
};

module.exports = { pictureValidate };
