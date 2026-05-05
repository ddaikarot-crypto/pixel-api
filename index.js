const express = require("express");
const Jimp = require("jimp");
const app = express();
 
app.get("/", (req, res) => {
    res.send("API");
});
 
app.get("/get_pixels", async (req, res) => {
    try {
        const url = req.query.url;
        if (!url) return res.status(400).send("missing url");
 
        const w = parseInt(req.query.w) || 51;
        const h = parseInt(req.query.h) || 39;
 
        if (w < 1 || h < 1 || w > 200 || h > 200)
            return res.status(400).send("invalid dimensions");
 
        const image = await Jimp.read(url);
 
        image.resize(w, h);
        image.flip(true, false);
 
        const pixels = [];
        for (let y = 0; y < h; y++) {
            for (let x = 0; x < w; x++) {
                const color = Jimp.intToRGBA(image.getPixelColor(x, y));
                pixels.push([color.r, color.g, color.b]);
            }
        }
 
        res.json(pixels);
    } catch (e) {
        res.status(500).send("error: " + e.message);
    }
});
 
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});
