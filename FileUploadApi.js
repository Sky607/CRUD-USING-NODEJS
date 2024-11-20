const http = require("http");
const multer = require("multer");
const fs = require("fs");
const path = require("path");

// Set up Multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = "./uploads";
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir); 
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "_" + file.originalname); 
  },
});


const fileFilter = (req, file, cb) => {
  const allowedExtensions = [".jpg", ".jpeg", ".png"];
  const fileExtension = path.extname(file.originalname).toLowerCase();

  if (!allowedExtensions.includes(fileExtension)) {
    return cb(new Error("Only .jpg and .png files are allowed!"));
  }
  cb(null, true);
};

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter,
}).any();

const server = http.createServer((req, res) => {
  if (req.method === "POST" && req.url === "/upload") {
    upload(req, res, (err) => {
      if (err) {
        console.error("Error uploading file:", err);
        res.writeHead(400, { "Content-Type": "text/plain" });
        res.end("Error uploading file: " + err.message);
        return;
      }

      // Files uploaded successfully
      const uploadedFiles = req.files.map(file => ({
        fieldName: file.fieldname,
        originalName: file.originalname,
        savedPath: file.path,
        size: file.size
      }));
    
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ message: "Files uploaded successfully", files: uploadedFiles}));
    });
  } else {
    res.writeHead(404, { "Content-Type": "text/plain" });
    res.end("Not Found");
  }
});

// Start the server
server.listen(3002, () => {
  console.log("Server running at http://localhost:3002");
});
