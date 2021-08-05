import { map, NodeCue, NodeList, parse, parseSync, Node } from "subtitle";
import { findInEpisode } from "./inEpisode";
import { Episode } from "../../../client/src/types";
import fs from "fs";
import fsA from "fs/promises";
import {
  getEpisodeNameFromSTR,
  getEpisodeOrderFromSTR,
  getRealTime,
} from "../files/files";
import { performance } from "perf_hooks";
import { findInTVA } from "./inSeasonAsync";

export const getShows = (raw: boolean = false) => {
  return fs.readdirSync(raw ? "subsRaw" : "subs");
};

export const getSeasons = (show: string, raw: boolean = false) => {
  return fs.readdirSync(`${raw ? "subsRaw" : "subs"}/${show}`);
};

export const getEpisodes = (
  show: string,
  season: string,
  raw: boolean = false
) => {
  return fs.readdirSync(`${raw ? "subsRaw" : "subs"}/${show}/${season}`);
};

export const getNodesFromEpisodeSTR = (
  show: string,
  season: string,
  episode: string
) => {
  const file = fs.readFileSync(`subsRaw/${show}/${season}/${episode}`);
  const text = file.toString();
  return parseSync(text);
};

export const getNodesFromEpisode = (
  show: string,
  season: string,
  episode: string
) => {
  const file = fs.readFileSync(`subs/${show}/${season}/${episode}`);
  const nodes: Node[] = JSON.parse(file.toString());
  return nodes;
};

export const findInTV = (show: string, text: string) => {
  const out: Episode[] = [];
  const shows = getShows();
  if (shows.includes(show)) {
    const seasons = getSeasons(show);
    for (const season of seasons) {
      const episodes = getEpisodes(show, season);
      for (const episode of episodes) {
        const nodes = getNodesFromEpisode(show, season, episode);
        const snippets = findInEpisode(nodes, text);
        if (snippets.length > 0) {
          out.push({
            season,
            order: getEpisodeOrderFromSTR(episode),
            snippets: getRealTime(nodes, snippets),
            name: getEpisodeNameFromSTR(episode),
          });
        }
      }
    }
  }
  return out;
};
