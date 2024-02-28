const sharp = require('sharp');
const path = require('path');
const logger = require('winston');

// Handle file upload
async function handleUpload(req, res) {
    if (!req.files || req.files.length === 0) {
        const errorMessage = 'No files uploaded.';
        logger.error(errorMessage);
        return res.status(400).send(errorMessage);
    }

    const uploadedFiles = req.files;
    const processedFiles = await processFiles(uploadedFiles);

    res.json(processedFiles);
}

// Process uploaded files (resize, etc.)
async function processFiles(files) {
    const processedFiles = [];

    for (const file of files) {
        const fileName = `${Date.now()}-${file.originalname}`;
        const filePath = path.join(__dirname, '../../uploads', fileName);

        // Resize image using sharp
        try {
            await sharp(file.buffer)
                .resize({ width: 300, height: 300 })
                .toFile(filePath);

            processedFiles.push({
                originalname: file.originalname,
                mimetype: file.mimetype,
                size: file.size,
                path: filePath,
            });
        } catch (error) {
            logger.error(`Error processing file ${file.originalname}: ${error.message}`);
        }
    }

    return processedFiles;
}

module.exports = {
    handleUpload,
};
