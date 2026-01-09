import express from "express";
import fetch from "node-fetch";
import fs from "fs";

const app = express();
const PORT = process.env.PORT || 3000;
const RIOT_KEY = process.env.RIOT_API_KEY;
const REGION = "la2";

// lista de PUUIDs
const PLAYERS = [
  { name: "Lushoto", puuid: "cAu3jEMQaLRBFhHYQ3_lBgf6Nyy_wCOCpaAD5TODb0LEtf0kmNYCe9xqZUhDFZvi2AA0QMLRiyjWLA" },
  { name: "Gwungle Account", puuid: "VYq90ZrnlZ8cBry-bZW9czUSf4yRu8P11HExr6lSmGLpXiwA5Q-EpdSEq6nnM01qMltX-U7DAnM6xg" }
];

async function getRankByPUUID(puuid) {
  const res = await fetch(
    `https://${REGION}.api.riotgames.com/lol/league/v4/entries/by-puuid/${puuid}?api_key=${RIOT_KEY}`
  );
  return res.json();
}

app.get("/export", async (_, res) => {
  let csv = "nombre,rango,liga,lp,ganadas,perdidas\n";

  for (const player of PLAYERS) {
    const data = await getRankByPUUID(player.puuid);
    const soloQ = data.find(e => e.queueType === "RANKED_SOLO_5x5");

    if (!soloQ) {
      csv += `${player.name},UNRANKED,-,0,0,0\n`;
      continue;
    }

    csv += `${player.name},${soloQ.tier},${soloQ.rank},${soloQ.leaguePoints},${soloQ.wins},${soloQ.losses}\n`;
  }

  fs.writeFileSync("ladder.csv", csv);
  res.download("ladder.csv");
});

app.listen(PORT, () => console.log("server ok"));
