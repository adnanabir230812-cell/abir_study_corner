const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');
const { Section, Pdf } = require('../models');

exports.handlePdfRequest = async (req, res) => {
  try {
    const { sectionId, action } = req.params; // action can be 'view' or 'download'
    const section = await Section.findByPk(sectionId);

    if (!section) {
      return res.status(404).send('Section not found');
    }

    const pdfsDir = path.resolve(__dirname, '..', 'pdfs');
    if (!fs.existsSync(pdfsDir)) {
      fs.mkdirSync(pdfsDir);
    }

    const outputPdfName = `section_${sectionId}.pdf`;
    const outputPdfPath = path.join(pdfsDir, outputPdfName);
    const dbPath = path.resolve(__dirname, '..', 'database.sqlite');
    const uvPath = 'C:\\Users\\Lenovo\\.local\\bin\\uv.exe';
    const scriptPath = path.resolve(__dirname, '..', 'python', 'generate_pdf.py');

    // Helper to send the file to client
    const sendPdfFile = () => {
      const disposition = action === 'download' ? 'attachment' : 'inline';
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `${disposition}; filename="${outputPdfName}"`);
      res.sendFile(outputPdfPath);
    };

    // Check if PDF already exists
    const pdfRecord = await Pdf.findOne({ where: { sectionId } });
    if (pdfRecord && fs.existsSync(outputPdfPath)) {
      return sendPdfFile();
    }

    // Otherwise, generate the PDF using the python script via uv
    console.log(`Spawning PDF generation process for section ${sectionId}...`);
    
    const pyProcess = spawn(uvPath, [
      'run',
      scriptPath,
      sectionId,
      dbPath,
      outputPdfPath
    ]);

    let stdoutData = '';
    let stderrData = '';

    pyProcess.stdout.on('data', (data) => {
      stdoutData += data.toString();
    });

    pyProcess.stderr.on('data', (data) => {
      stderrData += data.toString();
    });

    pyProcess.on('close', async (code) => {
      if (code !== 0) {
        console.error(`PDF generation process failed with code ${code}`);
        console.error(`Stderr: ${stderrData}`);
        return res.status(500).send('Failed to generate PDF. Error details in server logs.');
      }

      console.log('PDF generated successfully via Python.');
      
      // Update or create PDF record in database
      if (!pdfRecord) {
        await Pdf.create({
          sectionId,
          filePath: outputPdfPath,
          generatedAt: new Date()
        });
      } else {
        pdfRecord.generatedAt = new Date();
        await pdfRecord.save();
      }

      sendPdfFile();
    });

  } catch (err) {
    console.error('Error generating PDF:', err);
    res.status(500).send('Internal Server Error');
  }
};
