import express from "express";
import fetch from "node-fetch";
import fs from "fs";

const app = express();
const PORT = process.env.PORT || 3000;
const RIOT_KEY = process.env.RIOT_API_KEY;
const REGION = "la2";

// PUUIDs
const PLAYERS = [
  { name: "Jugador1", puuid: "PUUID_1" },
  { name: "Jugador2", puuid: "PUUID_2" }
];

async function getSummonerByPUUID(puuid) {
  const res = await fetch(
    `https://${REGION}.api.riotgames.com/lol/summoner/v4/summoners/by-puuid/${encodeURIComponent(puuid)}?api_key=${RIOT_KEY}`
  );
  if (!res.ok) return null;
  return res.json();
}

async function getRankBySummonerId(id) {
  const res = await fetch(
    `https://${REGION}.api.riotgames.com/lol/league/v4/entries/by-summoner/${id}?api_key=${RIOT_KEY}`
  );
  if (!res.ok) return [];
  return res.json();
}

app.get("/export", async (_, res) => {
  let csv = "nombre,rango,liga,lp,ganadas,perdidas\n";

  for (const player of PLAYERS) {
    const summoner = await getSummonerByPUUID(player.puuid);

    if (!summoner) {
      csv += `${player.name},ERROR,-,0,0,0\n`;
      continue;
    }

    const ranks = await getRankBySummonerId(summoner.id);
    const soloQ = ranks.find(r => r.queueType === "RANKED_SOLO_5x5");

    if (!soloQ) {
      csv += `${player.name},UNRANKED,-,0,0,0\n`;
      continue;
    }

    csv += `${player.name},${soloQ.tier},${soloQ.rank},${soloQ.leaguePoints},${soloQ.wins},${soloQ.losses}\n`;
  }

  fs.writeFileSync("ladder.csv", csv);
  res.download("ladder.csv");
});

app.listen(PORT, () => console.log("ok"));
