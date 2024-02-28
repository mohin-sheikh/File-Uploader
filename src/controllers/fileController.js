const path = require('path');
const logger = require('winston');

// Serve the HTML form for file upload
function renderForm(req, res) {
    res.sendFile(path.join(__dirname, '../index.html'));
}

module.exports = {
    renderForm,
};
