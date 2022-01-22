var fs = require("fs");
var request = require("request");

function padding_str(num, size) {
  var s = "000000000" + num.toString();
  return s.substr(s.length - size);
}

function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

var rawCharacters = JSON.parse(
  fs.readFileSync(__dirname + "/raw.json", "utf8")
);

var target_dir = __dirname + "/../../public/aigis/ch/";
if (!fs.existsSync(target_dir)) fs.mkdirSync(target_dir);

(async function () {
  for (const ch of rawCharacters) {
    const target_path = target_dir + ch.name + ".png";
    if (fs.existsSync(target_path)) continue;

    process.stdout.write("Fetch " + ch.name + " ... ");
    request(ch.icon).pipe(fs.createWriteStream(target_path));
    process.stdout.write("done\n");
    await sleep(3 * 1000);
  }
})();

const newCharacters = rawCharacters.map(ch => {
  return {
    name: ch.name,
    class: ch.class,
    rarity: ch.rarity,
    type: ch.type,
    gender: ch.gender,
    attributes: ch.attributes,
  };
});

fs.writeFileSync(
  __dirname + "/../../src/resources/aigis/characters.json",
  JSON.stringify(newCharacters, null, 2)
);