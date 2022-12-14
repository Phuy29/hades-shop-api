const express = require("express");
const router = express.Router();

const axios = require("axios");
const cheerio = require("cheerio");

const url = "https://hades.vn/collections/all#l=vi";

// [GET] all products
router.get("/", async (req, resp) => {
  const allProducts = [];
  try {
    const res = await axios(url);
    const html = await res.data;
    const $ = await cheerio.load(html);
    $(".product-block", html).each(function () {
      const name = $(this).find(".pro-name > a").attr("title");
      const href = $(this).find(".pro-name > a").attr("href");
      const price = $(this)
        .find(".pro-price")
        .text()
        .split("\n\t\t\t\t\t\t\n\t\t\t\t\t")[0];
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
    await resp.status(200).json(allProducts);
  } catch (error) {
    resp.status(500).json(error);
  }
});

module.exports = router;
