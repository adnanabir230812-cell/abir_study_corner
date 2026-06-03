const path = require('path');
const fs = require('fs');
const { Section } = require('../models');

exports.handlePdfRequest = async (req, res) => {
  try {
    const { sectionId, action } = req.params; // action can be 'view' or 'download'
    const section = await Section.findByPk(sectionId);

    if (!section) {
      return res.status(404).send('Section not found');
    }

    const outputPdfName = `section_${sectionId}.pdf`;
    const outputPdfPath = path.join(process.cwd(), 'pdfs', outputPdfName);

    if (!fs.existsSync(outputPdfPath)) {
      console.error(`Pre-generated PDF not found at: ${outputPdfPath}`);
      return res.status(404).send('PDF file not pre-generated for this section.');
    }

    const disposition = action === 'download' ? 'attachment' : 'inline';
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `${disposition}; filename="${outputPdfName}"`);
    res.sendFile(outputPdfPath);

  } catch (err) {
    console.error('Error serving PDF:', err);
    res.status(500).send('Internal Server Error');
  }
};
