// utils/bookHelpers.js
export const getImageData = (file) => ({
  coverImage: file.path,
  imagePublicId: file.filename,
});