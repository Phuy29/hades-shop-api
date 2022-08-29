const express = require("express");
const app = express();
const cors = require("cors");
const axios = require("axios");
const cheerio = require("cheerio");
const bodyParser = require("body-parser");

const url = "https://hades.vn/products/";

app.use(cors());
app.use(bodyParser.json({ limit: "50mb" }));
app.use(
  bodyParser.urlencoded({
    limit: "50mb",
    extended: true,
    parameterLimit: 50000,
  })
);

const routerAll = require("./api/all");
const routerTop = require("./api/top");
const routerBottom = require("./api/bottom");
const routerOuterwear = require("./api/outerwear");
const routerFootwear = require("./api/footwear");
const routerHat = require("./api/hat");
const routerBag = require("./api/bag");

app.get("/", (req, res) => {
  res.json("Hello");
});

app.use("/collections/all", routerAll);
app.use("/collections/top", routerTop);
app.use("/collections/bottom", routerBottom);
app.use("/collections/outerwear", routerOuterwear);
app.use("/collections/footwear", routerFootwear);
app.use("/collections/hat", routerHat);
app.use("/collections/bag", routerBag);

app.get("/products/:product", (req, resp) => {
  let productUrl = url + req.params.product + "#l=vi";

  try {
    axios(productUrl).then((res) => {
      const html = res.data;
      const $ = cheerio.load(html);

      const galleries = [];

      $(".product-detail-images-image-wrapper").each(function () {
        const gallery = $(this).find("img").attr("src");
        galleries.push(gallery);
      });

      const newArrival = $(".product-info > div > img").attr("src");

      const price = $(".product-price > .pro-price").html();

      const name = $("#title-local").html();

      product = [
        {
          name: name,
          price: price,
          galleries: galleries,
          newArrival: Boolean(newArrival),
        },
      ];
      resp.status(200).json(product);
    });
  } catch (error) {
    resp.status(500).json(error);
  }
});

const port = process.env.PORT || 8000;

app.listen(port, () => {
  console.log("Server is running ...");
});
