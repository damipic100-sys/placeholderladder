app.get("/ladder", async (req, res) => {
  const headers = {
    "X-Riot-Token": process.env.RIOT_KEY,
    "User-Agent": "riot-debug"
  };

  const acc = await fetch(
    "https://americas.api.riotgames.com/riot/account/v1/accounts/by-game-name/MAÑANAESTARDE/MET",
    { headers }
  ).then(r => r.json());

  const sum = await fetch(
    "https://la2.api.riotgames.com/lol/summoner/v4/summoners/by-puuid/" + acc.puuid,
    { headers }
  ).then(r => r.json());

  const ranks = await fetch(
    "https://la2.api.riotgames.com/lol/league/v4/entries/by-summoner/" + sum.id,
    { headers }
  ).then(r => r.json());

  res.json({ acc, sum, ranks });
});
