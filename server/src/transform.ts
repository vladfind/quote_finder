import * as fs from "fs";
import { parseSync } from "subtitle";
import { getEpisodeNameFromSTR, getEpisodeOrderFromSTR } from "./files/files";
import { findInEpisode } from "./find/inEpisode";
import {
  getSeasons,
  getEpisodes,
  getNodesFromEpisode,
  getShows,
  getNodesFromEpisodeSTR,
} from "./find/inSeason";

export function transformToJson() {
  console.log("start trasform");
  const shows = getShows(true);
  for (const show of shows) {
    const seasons = getSeasons(show, true);
    for (const season of seasons) {
      const episodes = getEpisodes(show, season, true);
      for (const episode of episodes) {
        console.log("here");
        const nodes = getNodesFromEpisodeSTR(show, season, episode);
        console.log("not here");
        if (!fs.existsSync(`subs/${show}`)) fs.mkdirSync(`subs/${show}`);
        if (!fs.existsSync(`subs/${show}/${season}`))
          fs.mkdirSync(`subs/${show}/${season}`);
        fs.writeFileSync(
          `subs/${show}/${season}/${getEpisodeOrderFromSTR(
            episode
          )} - ${getEpisodeNameFromSTR(episode)}.json`,
          JSON.stringify(nodes)
        );
        console.log(`${episode} done`);
      }
    }
  }
}

console.log("second input");
