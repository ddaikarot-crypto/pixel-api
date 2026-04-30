const express = require("express");
const Jimp = require("jimp");

const app = express();

app.get("/get_pixels", async (req, res) => {
    try {
        const url = req.query.url;
        if (!url) return res.status(400).send("missing url");

        const image = await Jimp.read(url);
        image.resize(51, 39);

        const pixels = [];

        for (let y = 0; y < 39; y++) {
            for (let x = 0; x < 51; x++) {
                const c = Jimp.intToRGBA(image.getPixelColor(x, y));
                pixels.push([c.r, c.g, c.b]);
            }
        }

        res.json(pixels);
    } catch (e) {
        res.status(500).send("error");
    }
});

app.listen(process.env.PORT || 3000);
