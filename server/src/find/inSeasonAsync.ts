import fsA from "fs/promises";
import { Episode } from "../../../client/src/types";
import { getRealTime, getEpisodeName, getEpisodeOrder } from "../files/files";
import { findInEpisode } from "./inEpisode";
import { NodeCue } from "subtitle";
import { performance } from "perf_hooks";

let getShowT = 0;
let getSeasonT = 0;
let getEpisodeT = 0;
let getNodesT = 0;
let findT = 0;

export const getShowsAsync = async () => {
  const start = performance.now();
  const a = await fsA.readdir("subs");
  const end = performance.now();
  getShowT += end - start;
  return a;
};

const getSeasonsAsync = async (show: string) => {
  const start = performance.now();
  const a = await fsA.readdir(`subs/${show}`);
  const end = performance.now();
  getSeasonT += end - start;
  return a;
};

export const getEpisodesAsync = async (show: string, season: string) => {
  const start = performance.now();
  const a = await fsA.readdir(`subs/${show}/${season}`);
  const end = performance.now();
  getEpisodeT += end - start;
  return a;
};

const getNodesFromEpisodeA = async (
  show: string = "Office",
  season: string = "1",
  episode: string = "The Office - 1x01 - Pilot.en.srt"
) => {
  const start = performance.now();
  const filePath = `subs/${show}/${season}/${episode}`;
  const file = await fsA.readFile(filePath);
  const nodes: NodeCue[] = JSON.parse(file.toString());
  const end = performance.now();
  getNodesT += end - start;
  return nodes;
};

/*
#1
60 * 1000 = 60s = 60 000

#2
61 * 1000 = 61s = 61 000
*/

//somehow the non async version is on average 180ms faster
export const findInTVA = async (show: string, text: string) => {
  getShowT = 0;
  getSeasonT = 0;
  getEpisodeT = 0;
  getNodesT = 0;
  findT = 0;
  const start = performance.now();
  const out: Episode[] = [];
  const shows = await getShowsAsync();
  if (shows.includes(show)) {
    const seasons = await getSeasonsAsync(show);
    for (const season of seasons) {
      const episodes = await getEpisodesAsync(show, season);
      for (const episode of episodes) {
        const nodes = await getNodesFromEpisodeA(show, season, episode);
        const start = performance.now();
        const snippets = findInEpisode(nodes, text);
        const end = performance.now();
        findT += end - start;
        if (snippets.length > 0) {
          out.push({
            season,
            order: getEpisodeOrder(episode),
            snippets: getRealTime(nodes, snippets),
            name: getEpisodeName(episode),
          });
        }
      }
    }
  }
  const end = performance.now();
  const total = end - start;
  console.log({ getShowT, getSeasonT, getEpisodeT, getNodesT, findT, total });

  return out;
};
