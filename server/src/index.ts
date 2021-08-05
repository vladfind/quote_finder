import express from "express";
import { findInTV, getEpisodes, getSeasons, getShows } from "./find/inSeason";
import { findInTVA, getShowsAsync } from "./find/inSeasonAsync";
import cors from "cors";
import { transformToJson } from "./transform";
import { getEpisodeNameAndOrder, getSnippetsFromEpisode } from "./files/files";
const app = express();
const PORT = 6002;

app.use(cors({ origin: "*" }));
app.use(express.json());

app.get("/shows", async (req, res) => {
  const shows = await getShowsAsync();
  res.json(shows);
});

app.post("/data", async (req, res) => {
  const { show, text } = req.body;
  const answer = await findInTVA(show, text);
  res.json(answer);
});

app.get("/episode", (req, res) => {
  res.json({ hellO: "13" });
});
app.get("/episode/:show/:season/:order", (req, res) => {
  const { show, season, order } = req.params as any;

  const shows = getShows();
  if (shows.includes(show)) {
    const seasons = getSeasons(show);
    if (seasons.includes(season)) {
      const episodes = getEpisodes(show, season).map((ep) =>
        getEpisodeNameAndOrder(ep)
      );
      const episode = episodes.find((ep) => ep[1] === order);
      if (episode) {
        const [name] = episode;
        const snippets = getSnippetsFromEpisode(
          show,
          season,
          `${order} - ${name}.json`
        );
        res.json(snippets);
        return;
      }
    }
  }

  res.sendStatus(404);
});

app.listen(PORT, () => {
  console.log(`Listening on ${PORT}`);
});
// transformToJson();
// testA();
