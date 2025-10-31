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

//hello


const express = require("express");
const satellite = require("./src/satellite");
const iridium = require("./src/iridium");

const app = express();
app.use(express.static("public")); // serve any scraped data or HTML files

// Run your scraping task once on startup
(async () => {
  try {
    await satellite.getTable({
      target: 25544,
      pages: 4,
      root: "./public/data/"
    });
    console.log("Initial scraping completed");
  } catch (error) {
    console.error("Error during initial scraping:", error.message);
  }
})();

// Optional: route to trigger scraping manually
app.get("/scrape", async (req, res) => {
  try {
    await satellite.getTable({
      target: 25544,
      pages: 4,
      root: "./public/data/"
    });
    res.send("Scraping completed successfully!");
  } catch (error) {
    console.error("Error during manual scraping:", error.message);
    res.status(500).send("Error during scraping: " + error.message);
  }
});

// Default route
app.get("/", (req, res) => {
  res.send("🚀 Heavens Above Scraper running successfully!");
});

// Handle errors
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  res.status(500).send("Internal server error");
});

// Heroku sets PORT dynamically
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
