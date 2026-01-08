import express from "express";
import fetch from "node-fetch";
import cors from "cors";

const app = express();
app.use(cors());

app.get("/ladder", async (req, res) => {
  try {
    const headers = {
      "X-Riot-Token": process.env.RIOT_KEY,
      "User-Agent": "riot-proxy-test"
    };

    const accRes = await fetch(
      "https://americas.api.riotgames.com/riot/account/v1/accounts/by-game-name/Surbrae/rawr",
      { headers }
    );

    const accText = await accRes.text();

    res.json({
      status: accRes.status,
      body: accText
    });

  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.listen(process.env.PORT || 3000);
