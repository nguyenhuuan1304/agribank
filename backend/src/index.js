const express = require('express');
const multer = require('multer');
const XLSX = require('xlsx');
const moment = require('moment');
const cors = require('cors');
const path = require('path');

const app = express();
const upload = multer({ dest: 'uploads/' });

app.use(cors());
app.use(express.json());

// In-memory storage (replace with database for production)
let transactions = [];

// Parse Remark field
function parseRemark(remark) {
  const keywords = ['In advance', 'Payment in advance', 'Deposit', 'TT in advance', 'TT trước', 'tạm ứng'];
  // Updated regex to handle "TT TRUOC 100% HD 8486" format
  const regex = new RegExp(`(${keywords.join('|')})\\s*(100%\\s*)?HD\\s*(\\w+)(.*)`);
  const match = remark.match(regex);
  if (match) {
    const contract = match[3];
    // No YYMMDD date in sample; assume null for now
    return { contract, expectedDate: null, submissionDate: null };
  }
  return { contract: null, expectedDate: null, submissionDate: null };
}

// API to upload Excel file
app.post('/upload', upload.single('file'), (req, res) => {
  try {
    if (!req.file || !req.file.mimetype.includes('spreadsheet')) {
      return res.status(400).json({ error: 'Invalid file format' });
    }

    const workbook = XLSX.readFile(req.file.path);
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const data = XLSX.utils.sheet_to_json(sheet);

    const requiredColumns = ['Trref', 'Custno', 'Custnm', 'Tradate', 'Currency', 'Amount', 'bencust', 'remark'];
    if (!requiredColumns.every(col => Object.keys(data[0]).includes(col))) {
      return res.status(400).json({ error: 'Missing required columns' });
    }

    transactions = data.map(row => ({
      'Trref': row['Trref'],
      'Custno': row['Custno'],
      'Custnm': row['Custnm'],
      'Tradate': row['Tradate'],
      'Currency': row['Currency'],
      'Amount': row['Amount'],
      'bencust': row['bencust'],
      ...parseRemark(row['remark'])
    }));

    require('fs').unlinkSync(req.file.path);
    res.json({ message: 'File processed successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// API for unsubmitted report
app.get('/report/unsubmitted', (req, res) => {
  res.json(transactions);
});

// API for overdue report
app.get('/report/overdue', (req, res) => {
  const currentDate = moment();
  const overdue = transactions.filter(t => t.submissionDate && moment(t.submissionDate).isBefore(currentDate));
  res.json(overdue);
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));