const express = require("express");
const Jimp = require("jimp");
const app = express();

app.get("/", (req, res) => {
    res.send("API Painter đang hoạt động! Hãy dùng /get_pixels?url=...");
});

app.get("/get_pixels", async (req, res) => {
    try {
        const url = req.query.url;
        if (!url) return res.status(400).send("missing url");

        const image = await Jimp.read(url);
        
        image.resize(51, 39);

        image.flip(true, false);

        const pixels = [];

        for (let y = 0; y < 39; y++) {
            for (let x = 0; x < 51; x++) {
                const color = Jimp.intToRGBA(image.getPixelColor(x, y));
                pixels.push([color.r, color.g, color.b]);
            }
        }

        res.json(pixels);
    } catch (e) {
        console.error(e);
        res.status(500).send("error processing image");
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server đang chạy tại: http://localhost:${PORT}`);
});
