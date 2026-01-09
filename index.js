import express from "express";
import fetch from "node-fetch";
import fs from "fs";

const app = express();
const PORT = process.env.PORT || 3000;
const RIOT_KEY = process.env.RIOT_API_KEY;

// summoner names
const PLAYERS = [
  "Summoner1",
  "Summoner2",
  "Summoner3"
];

const REGION = "la2"; // LAS
const ROUTE = "americas";

async function getSummoner(name) {
  const res = await fetch(
    `https://${REGION}.api.riotgames.com/lol/summoner/v4/summoners/by-name/${encodeURIComponent(name)}?api_key=${RIOT_KEY}`
  );
  return res.json();
}

async function getRank(summonerId) {
  const res = await fetch(
    `https://${REGION}.api.riotgames.com/lol/league/v4/entries/by-summoner/${summonerId}?api_key=${RIOT_KEY}`
  );
  const data = await res.json();
  return data.find(q => q.queueType === "RANKED_SOLO_5x5");
}

app.get("/export", async (_, res) => {
  let csv = "nombre,rango,liga,lp,ganadas,perdidas\n";

  for (const name of PLAYERS) {
    const summoner = await getSummoner(name);
    const rank = await getRank(summoner.id);

    if (!rank) continue;

    csv += `${name},${rank.tier},${rank.rank},${rank.leaguePoints},${rank.wins},${rank.losses}\n`;
  }

  fs.writeFileSync("ladder.csv", csv);
  res.download("ladder.csv");
});

app.listen(PORT, () => console.log("OK en puerto", PORT));
