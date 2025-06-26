import express from 'express';
import cors from 'cors';
import multer from 'multer';  //multer handles file uploads
import fs from 'fs'; //read/write files on the server.
import path from 'path';
import _ from 'lodash';
import fetch from 'node-fetch'; //To make external HTTP requests
import { fileURLToPath } from 'url';
import { dirname } from 'path';
//gives the current file path and folder path
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads')); //Serves static files from the /uploads folder

//route test
app.get('/', (req, res) => {
  res.send('Server is running');
});

// Multer Setup - Files saved and format
const storage = multer.diskStorage({
  destination: './uploads',
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});
const upload = multer({ storage });

// Upload multiple images
app.post('/upload-multiple', upload.array('images', 10), (req, res) => {
  res.json({ message: 'Images uploaded successfully', files: req.files });
});

// Get 3 random images
app.get('/random-images', (req, res) => {
  fs.readdir('./uploads', (err, files) => { //Reads all image filenames from uploads
    if (err) return res.status(500).send('Error reading images');
    const randomFiles = _.sampleSize(files, 3); //Picks 3 random ones using lodash.sampleSize()
    const urls = randomFiles.map(file => `http://localhost:${PORT}/uploads/${file}`);
    res.json(urls);//Sends their full URLs back as a JSON array.

  });
});

// Upload dog image from URL
app.post('/upload-dog', async (req, res) => {
  const { imageUrl } = req.body;  //Receives an image URL
  const fileName = `${Date.now()}-dog.jpg`;
  const filePath = path.join(__dirname, 'uploads', fileName);

  const response = await fetch(imageUrl); //Fetches the image from the provided URL using node-fetch
  const buffer = await response.arrayBuffer(); //Reads the response data as a binary stream
  fs.writeFileSync(filePath, Buffer.from(buffer));//Converts the buffer into a Node.js Buffer and writes the image to the server file system.
  res.json({ message: 'Dog image uploaded', file: `/uploads/${fileName}` });
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
