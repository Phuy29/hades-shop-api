const express = require("express");
const router = express.Router();

const axios = require("axios");
const cheerio = require("cheerio");

const url = "https://hades.vn/collections/outerwear#l=vi";

// [GET] all bottoms
router.get("/", (req, resp) => {
  const allProducts = [];
  try {
    axios(url).then((res) => {
      const html = res.data;
      const $ = cheerio.load(html);
      $(".product-block", html).each(function () {
        const name = $(this).find(".pro-name > a").attr("title");
        const href = $(this).find(".pro-name > a").attr("href");
        const price = $(this).find(".pro-price").html().slice(0, 8);
        const imgUrl = $(this).find(".img-loop").attr("src");
        const imgHover = $(this).find(".img-hover").attr("src");
        allProducts.push({
          name,
          href,
          price,
          imgUrl,
          imgHoverUrl: imgHover,
        });
      });
      resp.status(200).json(allProducts);
    });
  } catch (error) {
    resp.status(500).json(error);
  }
});

module.exports = router;
