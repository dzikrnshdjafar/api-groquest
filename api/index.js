const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const { Groq } = require("groq-sdk");

// Konfigurasi environment variables
dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Inisialisasi Groq SDK
const groq = new Groq({
  apiKey: process.env.GROQ_APIKEY,
});

// Endpoint untuk menerima permintaan dari frontend
app.post("/api/groq", async (req, res) => {
  try {
    const { content } = req.body;

    if (!content) {
      return res.status(400).json({ error: "Content is required" });
    }

    // Kirim permintaan ke Groq API
    const reply = await groq.chat.completions.create({
      messages: [
        {
          role: "user",
          content,
        },
      ],
      model: "llama3-8b-8192",
    });

    // Kirim respons kembali ke frontend
    res.status(200).json({
      message: reply.choices[0].message.content,
    });
  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Jalankan server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
