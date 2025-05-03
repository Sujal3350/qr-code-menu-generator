const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(bodyParser.json());

// MongoDB connection
mongoose.connect("mongodb://localhost:27017/qrMenuDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const qrCodeSchema = new mongoose.Schema({
  menuId: String,
  qrCodeUrl: String,
});

const QRCode = mongoose.model("QRCode", qrCodeSchema);

// API endpoint to save QR code
app.post("/api/qr-codes", async (req, res) => {
  const { menuId, qrCodeUrl } = req.body;

  try {
    const qrCode = new QRCode({ menuId, qrCodeUrl });
    await qrCode.save();
    res.status(201).send({ message: "QR code saved successfully" });
  } catch (error) {
    console.error("Error saving QR code:", error);
    res.status(500).send({ message: "Failed to save QR code" });
  }
});

// Start the server
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
