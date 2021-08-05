import { snippetRaw, snippet } from "../../../client/src/types";
import { Node, NodeCue } from "subtitle";
import { getNodesFromEpisode } from "../find/inSeason";
import { getEpisodesAsync } from "../find/inSeasonAsync";

export const getEpisodeNameFromSTR = (text: string): string => {
  //TODO handle the case when the name has -
  //for example "Day - Start" or somthings
  const [showName, order, fullName] = text.split(" - ");
  let name = "";
  for (let charIdx = 0; charIdx < fullName.length; charIdx++) {
    const char = fullName[charIdx];
    //only break on "\.." (regex)
    //don't break if there's a space after a dot
    if (
      char === "." &&
      charIdx + 1 < fullName.length &&
      fullName[charIdx + 1] !== " "
    ) {
      break;
    }
    name += char;
  }
  return name;
};

export const getEpisodeName = (text: string): string => {
  const [order, name] = text.split(" - ");
  return name.replace(".json", "");
};

export const getEpisodeOrder = (text: string): string => {
  return text.split(" - ")[0];
};

export const getEpisodeNameAndOrder = (text: string) => {
  const name = getEpisodeName(text);
  const order = getEpisodeOrder(text);
  return [name, order];
};

export const getEpisodeOrderFromSTR = (text: string) => {
  const fullOrder = text.split(" - ")[1];
  return fullOrder.split("x")[1];
};

export const convertMsToTime = (ms: number) => {
  const addZero = (time: number) => {
    return time < 10 ? `0${Math.floor(time)}` : Math.floor(time);
  };

  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(ms / (1000 * 60));
  const hours = Math.floor(ms / (1000 * 60 * 60));
  if (seconds < 60) {
    return `0:${addZero(seconds)}`;
  }
  if (minutes < 60) {
    //remove absolute value of full minutes from ms and
    // then convert it to seconds
    const nextSecond = Math.floor(ms - minutes * 1000 * 60) / 1000;
    return `${minutes}:${addZero(nextSecond)}`;
  }
  //basically the same thing as above but with minutes
  const nextMinutes = Math.floor(ms - hours * 1000 * 60 * 60) / (1000 * 60);
  //remove full hours and full minutes from ms and
  // convert the rest into seconds
  const nextSecond =
    Math.floor(ms - (hours * 1000 * 60 * 60 + nextMinutes * 1000 * 60)) / 1000;
  return `${hours}:${addZero(nextMinutes)}:${addZero(nextSecond)}`;
};

export const getRealTime = (nodes: Node[], snippets: snippetRaw[]) => {
  const out: snippet[] = [];
  for (const snippet of snippets) {
    const next: snippet = {
      text: "",
      start: "0:00",
      end: "0:00",
    };
    out.push(next);
    const startNode = nodes[snippet.start];
    if (startNode.type == "cue") {
      next.text = snippet.text;
      next.start = convertMsToTime(startNode.data.start);
    }
    const endNode = nodes[snippet.end];
    if (endNode.type == "cue") {
      next.end = convertMsToTime(endNode.data.end);
    }
  }
  return out;
};

export const getSnippetsFromEpisode = (
  show: string,
  season: string,
  episode: string
) => {
  const nodes = getNodesFromEpisode(show, season, episode);
  const snippets: snippet[] = [];

  for (const node of nodes) {
    if (node.type === "cue") {
      snippets.push({
        text: node.data.text,
        start: convertMsToTime(node.data.start),
        end: convertMsToTime(node.data.end),
      });
    }
  }
  return snippets;
};

export const getFullEpisodeName = async (
  show: string,
  season: string,
  episode: string
) => {
  let out: null | string = null;
  try {
    const episodes = await getEpisodesAsync(show, season);
    for (const episode of episodes) {
      if (episode.includes(`${show}`)) {
        out = episode;
      }
    }
  } catch (error) {}
  return out;
};
