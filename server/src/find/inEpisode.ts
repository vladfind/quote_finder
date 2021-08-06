import { readFileSync } from "fs";
import { NodeCue, NodeList, parseSync } from "subtitle";
import { snippetRaw } from "../../../client/src/types";

export const getNodes = () => {
  const file = readFileSync("./subs/pilot.srt");
  const str = file.toString();
  const nodes = parseSync(str);
  return nodes;
};

const nodesToList = (nodes: NodeList) => {};

const nodesToText = (nodes: NodeList) => {
  let out = "";
  for (const node of nodes) {
    if (node.type === "cue") {
      out += node.data.text;
    }
  }
  return out;
};

const getWords = (nodes: NodeCue[]) => {
  let out: { word: string; node: number }[] = [];
  for (const [idx, node] of nodes.entries()) {
    const rawString = node.data.text;
    const string = rawString.replace(/(\r\n|\n|\r)/gm, " ");
    const words = string.split(" ");
    for (const word of words) {
      out.push({ word, node: idx });
    }
  }

  return out;
};

/*
if word in node
  if next_word in node (without the last word)
    if next_next_word ...
  else
    return null
else 
  return null
*/
export function findAllMatches(nodes: NodeCue[], sentence: string) {
  const words = getWords(nodes);
  const qs = sentence.split(" ");

  const out: snippetRaw[] = [];

  for (let wordIndex = 0; wordIndex < words.length; wordIndex++) {
    let matches = 0;
    for (const q of qs) {
      let word = words[wordIndex + matches];

      if (!word.word.includes(q)) {
        break;
      }
      matches++;

      if (matches === qs.length) {
        const startWord = words[wordIndex];
        const endWord = words[wordIndex + matches - 1];
        const fullText = nodes
          .slice(startWord.node, word.node + 1)
          .map((i) => i.data.text)
          .join(" ");
        out.push({ text: fullText, start: startWord.node, end: endWord.node });
        //OPTIMAZATION: move wordIndex to last word we used. then after 'for loop'++, it will become
        //the word after it, so we skip all the word that we've already chosen
        wordIndex = wordIndex + matches - 1;
      }
    }
  }
  return out;
}

export const findInEpisode = (nodes: NodeCue[], sentence: string) => {
  const result = findAllMatches(nodes, sentence);
  return result;
};
