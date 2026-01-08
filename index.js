import express from "express";
import fetch from "node-fetch";
import cors from "cors";

const app = express();
const PORT = process.env.PORT || 3000;
const RIOT_KEY = process.env.RIOT_KEY;

app.use(cors()); // 🔥 FIX REAL

app.get("/ladder", async (req, res) => {
  try {
    const players = [
      { name: "bic", tag: "717", region: "la2" }
    ];

    const headers = {
      "X-Riot-Token": RIOT_KEY,
      "User-Agent": "riot-proxy/1.0"
    };

    const out = [];

    for (const p of players) {
      const accRes = await fetch(
        `https://americas.api.riotgames.com/riot/account/v1/accounts/by-game-name/${p.name}/${p.tag}`,
        { headers }
      );
      if (!accRes.ok) continue;
      const acc = await accRes.json();

      const sumRes = await fetch(
        `https://${p.region}.api.riotgames.com/lol/summoner/v4/summoners/by-puuid/${acc.puuid}`,
        { headers }
      );
      if (!sumRes.ok) continue;
      const sum = await sumRes.json();

      const rankRes = await fetch(
        `https://${p.region}.api.riotgames.com/lol/league/v4/entries/by-summoner/${sum.id}`,
        { headers }
      );
      if (!rankRes.ok) continue;

      const ranks = await rankRes.json();
      out.push(ranks);
    }

    res.json(out);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.listen(PORT);
