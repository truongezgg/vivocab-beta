const fs = require("fs");
const data = require("./src/data/oxford-3000-a2.json");
data.forEach((item) => {
  item.subLessons.forEach((el) => {
    el.description = el.vocabularies.map((vocab) => vocab.text).join(", ");
  });
});
// write file to json file
fs.writeFileSync("oxford-3000-a2.json", JSON.stringify(data));
