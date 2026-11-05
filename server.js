const express = require('express');
const multer = require('multer');
const path = require('path');
const cors = require('cors');
const db = require('./db');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ตั้งค่าการอัปโหลดไฟล์ด้วย Multer (จำกัดขนาดไม่เกิน 25MB)
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});
const upload = multer({ storage: storage, limits: { fileSize: 25 * 1024 * 1024 } });

// API: ดึงรายการหนังสือทั้งหมด
app.get('/api/documents', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM documents ORDER BY id DESC');
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch documents' });
  }
});

// API: สร้างและส่งหนังสือราชการใหม่พร้อมไฟล์แนบ
app.post('/api/documents', upload.single('attachment'), async (req, res) => {
  try {
    const { doc_no, doc_date, urgency, subject, from_agency, to_agency, to_person, created_by_agency, sent_by } = req.body;
    let filePath = null, fileName = null, fileSize = null;

    if (req.file) {
      filePath = '/uploads/' + req.file.filename;
      fileName = req.file.originalname;
      fileSize = (req.file.size / 1024).toFixed(1) + ' KB';
    }

    const query = `
      INSERT INTO documents 
      (doc_no, doc_date, urgency, subject, from_agency, to_agency, to_person, created_by_agency, sent_by, file_path, file_name, file_size, status) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'sent')
    `;
    const [result] = await db.query(query, [
      doc_no, doc_date, urgency || 'ปกติ', subject, from_agency, to_agency, to_person, created_by_agency, sent_by, filePath, fileName, fileSize
    ]);

    res.json({ message: 'Document created successfully', id: result.insertId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create document' });
  }
});

// API: ลงรับหนังสือ
app.put('/api/documents/:id/receive', async (req, res) => {
  try {
    const { id } = req.params;
    const { received_by, rec_no } = req.body;
    const received_at = new Date().toLocaleString('th-TH');

    await db.query(
      `UPDATE documents SET status = 'received', rec_no = ?, received_by = ?, received_at = ? WHERE id = ?`,
      [rec_no, received_by, received_at, id]
    );
    res.json({ message: 'Document received successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to receive document' });
  }
});

// API: ปิดงานหนังสือ
app.put('/api/documents/:id/close', async (req, res) => {
  try {
    const { id } = req.params;
    const closed_at = new Date().toLocaleString('th-TH');
    await db.query(`UPDATE documents SET status = 'closed', closed_at = ? WHERE id = ?`, [closed_at, id]);
    res.json({ message: 'Document closed successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to close document' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});