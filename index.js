const fs = require("fs");
const sha256 = require("js-sha256");
const { parse } = require("csv-parse");

const csvData = [];

fs.createReadStream("./HNGi9_CSV_FILE _Sheet1.csv")
  .pipe(parse({ delimiter: ",", from_line: 2 }))
  .on("data", function (row) {
    csvData.push(Object(row));
  })
  .on("end", () => {
    let teamName = "";
    for (data of csvData) {
      if (data[0] && data[0].includes("TEAM")) {
        teamName = data[0];
      }

      const jsonformat = {
        format: "CHIP-0007",
        name: data[3],
        description: data[4],
        minting_tool: teamName, // team name
        sensitive_content: false,
        series_number: data[1], // serial number
        series_total: csvData[csvData.length - 1][1], // total serial number
        attributes: [
          {
            trait_type: "gender", // gender, key
            value: data[5], // value
          },
        ],
        collection: {
          name: "Zuri NFT Tickets for Free Lunch",
          id: "b774f676-c1d5-422e-beed-00ef5510c64d",
          attributes: [
            {
              type: "description",
              value: "Rewards for accomplishments during HNGi9.",
            },
          ],
        },
      };

      let allAttributes = data[6].split(";");
      allAttributes.pop();

      for (attribute of allAttributes) {
        let splittedAttribute = attribute.split(":");
        jsonformat.attributes.push({
          trait_type: splittedAttribute[0], // gender, key
          value: splittedAttribute[1], // value
        });
      }
      const CHIP_0007 = JSON.stringify(jsonformat);
      const hash = sha256(CHIP_0007);
      console.log(hash);
      break;
    }
  });
