const { Client, Collection } = require('discord.js');
const { loadCommands, loadEvents, loadDblEvents } = require("./util/loader");
const { GiveawaysManager } = require("discord-giveaways");
const { DBLTOKEN } = require('./config');
const db = require("quick.db");
if(!db.get("giveaways")) db.set("giveaways", []);

const client = new Client({ partials: ['MESSAGE', 'CHANNEL', 'REACTION']});

const DBL = require('dblapi.js');
const dbl = new DBL(DBLTOKEN, { webhookPort: 8000, webhookAuth: 'anyPassword' });


// début giveaways
const GiveawayManagerWithOwnDatabase = class extends GiveawaysManager {
  async getAllGiveaways(){
      return db.get("giveaways");
  }
  async saveGiveaway(messageID, giveawayData){
      db.push("giveaways", giveawayData);
      return true;
  }
  async editGiveaway(messageID, giveawayData){
      const giveaways = db.get("giveaways");
      const newGiveawaysArray = giveaways.filter((giveaway) => giveaway.messageID !== messageID);
      newGiveawaysArray.push(giveawayData);
      db.set("giveaways", newGiveawaysArray);
      return true;
  }
  async deleteGiveaway(messageID){
      const newGiveawaysArray = db.get("giveaways").filter((giveaway) => giveaway.messageID !== messageID);
      db.set("giveaways", newGiveawaysArray);
      return true;
  }
};
const manager = new GiveawayManagerWithOwnDatabase(client, {
  storage: false,
  updateCountdownEvery: 5000,
  default: {
      botsCanWin: false,
      exemptPermissions: [ "MANAGE_MESSAGES", "ADMINISTRATOR" ],
      embedColor: "#ed1c24",
      reaction: "🎉"
  }
});
// fin giveaways


require("./util/functions")(client);
client.config = require("./config");
client.mongoose = require("./util/mongoose");
client.queue = new Map();
client.giveawaysManager = manager;
client.dbl = dbl;
["commands", "cooldowns"].forEach(x => client[x] = new Collection());

loadCommands(client);
loadEvents(client);
loadDblEvents(dbl, client);
client.mongoose.init();

dbl.on('error', e => {
    console.log(`Oops! ${e}`);
 });

client.on("warn", (info) => console.log(info));
client.on("error", console.error);

client.login(client.config.TOKEN);