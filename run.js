// const satellite = require("./src/satellite");
// const iridium = require("./src/iridium");

// var location = [39.9042, 116.4074, "%E5%8C%97%E4%BA%AC%E5%B8%82", 52, "ChST"];
// //COOKIE需要先通过浏览器调到中文

// //const names = ["ISS", "IridiumFlares"];
// // https://www.heavens-above.com/PassSummary.aspx?satid=41765&lat=0&lng=0&loc=Unspecified&alt=0&tz=UCT

// satellite.getTable({
// 	target: 25544,
// 	pages: 4,
// 	root: "./public/data/"
// }); //ISS
// /*
// iridium.getTable({
// 	pages: 4,
// 	root: "./public/data/"
// });
// */


const express = require("express");
const satellite = require("./src/satellite");
const iridium = require("./src/iridium");

const app = express();
app.use(express.static("public")); // serve any scraped data or HTML files

// Run your scraping task once on startup
satellite.getTable({
  target: 25544,
  pages: 4,
  root: "./public/data/"
});

// Optional: route to trigger scraping manually
app.get("/scrape", (req, res) => {
  satellite.getTable({
    target: 25544,
    pages: 4,
    root: "./public/data/"
  });
  res.send("Scraping started...");
});

// Default route
app.get("/", (req, res) => {
  res.send("🚀 Heavens Above Scraper running successfully on Heroku!");
});

// Heroku sets PORT dynamically
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
