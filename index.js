const express = require("express");
const Jimp = require("jimp");
const app = express();

// Route mặc định để tránh lỗi "Cannot GET /"
app.get("/", (req, res) => {
    res.send("API Painter Online is Running!");
});

app.get("/get_pixels", async (req, res) => {
    try {
        const url = req.query.url;
        if (!url) return res.status(400).send("missing url");

        const image = await Jimp.read(url);
        
        // 1. Resize chuẩn cho 51x39 blocks
        image.resize(51, 39);

        // 2. FIX LỖI TRÁI PHẢI (Lật ngang ảnh)
        image.flip(true, false);

        const pixels = [];
        // Quét pixel theo hàng (y) và cột (x)
        for (let y = 0; y < 39; y++) {
            for (let x = 0; x < 51; x++) {
                const color = Jimp.intToRGBA(image.getPixelColor(x, y));
                pixels.push([color.r, color.g, color.b]);
            }
        }

        res.json(pixels);
    } catch (e) {
        res.status(500).send("error");
    }
});

// Render yêu cầu port phải lấy từ process.env.PORT
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});
