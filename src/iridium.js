const axios = require("axios");
const cheerio = require("cheerio");
const fs = require("fs");
const utils = require("./utils");

const eventsIridium = ["brightness", "altitude", "azimuth", "satellite", "distanceToFlareCentre", "brightnessAtFlareCentre", "date", "time", "distanceToSatellite", "AngleOffFlareCentre-line", "flareProducingAntenna", "sunAltitude", "angularSeparationFromSun", "image", "id"];

async function getTable(config) {
    let database = config.database || [];
    let counter = config.counter || 0;
    const opt = config.opt || 0;
    const basedir = config.root + "IridiumFlares/";

    let options;
    if (counter === 0) {
        options = utils.get_options("IridiumFlares.aspx?");
        if (!fs.existsSync(basedir)) {
            fs.mkdirSync(basedir, { recursive: true });
        }
    } else {
        options = utils.post_options("IridiumFlares.aspx?", opt);
    }

    try {
        const response = await axios(options);
        const $ = cheerio.load(response.data, {
            decodeEntities: false
        });

        let next = "__EVENTTARGET=&__EVENTARGUMENT=&__LASTFOCUS=";
        const tbody = $("form").find("table.standardTable tbody");
        const queue = [];

        tbody.find("tr").each((i, o) => {
            const temp = {};
            for (let i = 0; i < 6; i++) {
                temp[eventsIridium[i]] = $(o).find("td").eq(i + 1).text();
            }
            temp["url"] = "https://www.heavens-above.com/" + $(o).find("td").eq(0).find("a").attr("href").replace("type=V", "type=A");
            queue.push(temp);
        });

        async function factory(temp) {
            try {
                const response = await axios(utils.iridium_options(temp["url"]));
                console.log("Success", temp);

                const $ = cheerio.load(response.data, {
                    decodeEntities: false
                });

                const table = $("form").find("table.standardTable");
                const tr = table.find("tbody tr");

                [
                    [6, 0],
                    [7, 1],
                    [8, 6],
                    [9, 7],
                    [10, 9],
                    [11, 10],
                    [12, 11]
                ].forEach((ele) => {
                    temp[eventsIridium[ele[0]]] = tr.eq(ele[1]).find("td").eq(1).text();
                });

                temp[eventsIridium[13]] = "https://www.heavens-above.com/" + $("#ctl00_cph1_imgSkyChart").attr("src");
                const id = utils.md5(Math.random().toString());
                temp[eventsIridium[14]] = id;

                // Save the table HTML
                fs.writeFileSync(basedir + id + ".html", table.html());

                // Download and save the image
                const imgUrl = temp[eventsIridium[13]];
                if (imgUrl) {
                    const imgResponse = await axios.get(imgUrl, { responseType: "arraybuffer" });
                    fs.writeFileSync(basedir + id + ".png", imgResponse.data);
                }

                return temp;
            } catch (error) {
                console.error("Error processing iridium data:", error.message);
                throw error;
            }
        }

        const results = await Promise.allSettled(queue.map(temp => factory(temp)));
        const fulfilled = results.filter(p => p.status === "fulfilled").map(p => p.value);
        database = database.concat(fulfilled);

        $("form").find("input").each((i, o) => {
            if ($(o).attr("name") === "ctl00$cph1$btnPrev" || $(o).attr("name") === "ctl00$cph1$visible") return;
            else next += `&${$(o).attr("name")}=${$(o).attr("value")}`;
        });
        next += "&ctl00$cph1$visible=radioVisible";
        next = next.replace(/\+/g, "%2B").replace(/\//g, "%2F");

        if (counter++ < config.pages) {
            await getTable({
                count: config.count,
                pages: config.pages,
                root: config.root,
                counter,
                opt: next,
                database
            });
        } else {
            fs.writeFileSync(basedir + "index.json", JSON.stringify(database, null, 2));
        }
    } catch (error) {
        console.error("Error fetching iridium flares:", error.message);
    }
}

exports.getTable = getTable;
