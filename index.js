import express from "express";
import fetch from "node-fetch";

const app = express();
const PORT = process.env.PORT || 3000;
const RIOT_KEY = process.env.RIOT_KEY;

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  next();
});

app.get("/ladder", async (req, res) => {
  const players = [
    { name: "DAMI", tag: "ARG", region: "la2" }
  ];

  const headers = {
    "X-Riot-Token": RIOT_KEY,
    "User-Agent": "riot-proxy/1.0"
  };

  const out = [];

  for (const p of players) {
    try {
      const acc = await fetch(
        `https://americas.api.riotgames.com/riot/account/v1/accounts/by-game-name/${p.name}/${p.tag}`,
        { headers }
      ).then(r => r.json());

      const sum = await fetch(
        `https://${p.region}.api.riotgames.com/lol/summoner/v4/summoners/by-puuid/${acc.puuid}`,
        { headers }
      ).then(r => r.json());

      const ranks = await fetch(
        `https://${p.region}.api.riotgames.com/lol/league/v4/entries/by-summoner/${sum.id}`,
        { headers }
      ).then(r => r.json());

      out.push(ranks);
    } catch {}
  }

  res.json(out);
});

app.listen(PORT);
