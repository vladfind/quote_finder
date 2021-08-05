import { readFileSync } from "fs";
import { NodeList, parseSync } from "subtitle";
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

const getWords = (nodes: NodeList) => {
  let out: { word: string; node: number }[] = [];
  for (const [idx, node] of nodes.entries()) {
    if (node.type === "cue") {
      const rawString = node.data.text;
      const string = rawString.replace(/(\r\n|\n|\r)/gm, " ");
      const words = string.split(" ");
      for (const word of words) {
        out.push({ word, node: idx });
      }
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
export function findAllMatches(nodes: NodeList, sentence: string) {
  const words = getWords(nodes);
  const qs = sentence.split(" ");

  const out: snippetRaw[] = [];

  let wordIndex = 0;
  let qIndex = 0;
  while (wordIndex < words.length) {
    const word = words[wordIndex];
    const q = qs[qIndex];
    if (word.word.includes(q)) {
      //we've found the last word
      if (qIndex === qs.length - 1) {
        //move the whole phraze to the begginging to ge stuff
        const startWord = words[wordIndex - qIndex];
        let fullText = "";

        //do this this to add a space between nodes, but
        //do not add a space after the last node
        for (let i = startWord.node; i < word.node; i++) {
          fullText += (nodes[i].data as any).text + " ";
        }
        fullText += (nodes[word.node].data as any).text;
        out.push({ start: startWord.node, end: word.node, text: fullText });

        //move the word and restart the query
        wordIndex++;
        qIndex = 0;
      }
      //we've found the word, but it's not the last one
      else {
        //move the word and the query word
        wordIndex++;
        qIndex++;
      }
    } else {
      //if we havent' been building, just move the word,
      if (qIndex === 0) {
        wordIndex++;
      }
      //otherwise keep the word and stop building
      else {
        qIndex = 0;
      }
    }
  }
  return out;
}

export const findInEpisode = (nodes: NodeList, sentence: string) => {
  const result = findAllMatches(nodes, sentence);
  return result;
};
