const fs = require('fs/promises');
const path = require('path');
const crypto = require('crypto');
const { fieldError } = require('../utils/crudHandlers');

const UPLOAD_DIR = path.join(__dirname, '../../uploads');

// Identify the real file type from its first bytes, not from its name.
const detectImageType = (buffer) => {
  if (buffer.length >= 3 && buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff) {
    return 'jpg';
  }

  const pngSignature = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
  if (buffer.length >= 8 && buffer.subarray(0, 8).equals(pngSignature)) {
    return 'png';
  }

  if (
    buffer.length >= 12 &&
    buffer.toString('ascii', 0, 4) === 'RIFF' &&
    buffer.toString('ascii', 8, 12) === 'WEBP'
  ) {
    return 'webp';
  }

  return null;
};

// POST /api/uploads  (admin)
const uploadImage = async (req, res) => {
  if (!req.file) {
    throw fieldError(400, 'image', 'An image file is required (form field name: image).');
  }

  const extension = detectImageType(req.file.buffer);
  if (!extension) {
    throw fieldError(400, 'image', 'Only JPG, PNG or WebP images are allowed.');
  }

  await fs.mkdir(UPLOAD_DIR, { recursive: true });

  // Our own random name: the client's filename is never used.
  const filename = `${Date.now()}-${crypto.randomBytes(8).toString('hex')}.${extension}`;
  await fs.writeFile(path.join(UPLOAD_DIR, filename), req.file.buffer);

  res.status(201).json({
    success: true,
    message: 'Image uploaded.',
    data: { url: `/uploads/${filename}` },
  });
};

module.exports = { uploadImage };