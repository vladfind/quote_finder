import { findAllMatches, getNodes } from "../src/find/inEpisode";
import { snippetRaw } from "../../client/src/types";
import { Node } from "subtitle";

const getNode = (text: string): Node => {
  return { type: "cue", data: { text, start: 0, end: 0 } };
};

describe("findAllMatches", () => {
  it("matches: hello world", () => {
    const nodes = [] as Node[];
    nodes.push(getNode("vlad"));
    nodes.push(getNode("hello"));
    nodes.push(getNode("world"));
    nodes.push(getNode("to you"));

    const out: snippetRaw[] = [{ start: 1, end: 2, text: "hello world" }];
    expect(findAllMatches(nodes, "hello world")).toEqual(out);
  });

  it("matches: good", () => {
    const nodes = [] as Node[];
    nodes.push(getNode("All right Jim your quarterlies look very good."));
    nodes.push(getNode("How the thing is going at the library?"));
    nodes.push(getNode("Oh I told you couldn't closet so"));
    nodes.push(getNode("So you've come to themaster for guidance?"));

    const out: snippetRaw[] = [
      {
        start: 0,
        end: 0,
        text: "All right Jim your quarterlies look very good.",
      },
    ];
    expect(findAllMatches(nodes, "good")).toEqual(out);
  });

  it("matches nothing", () => {
    const nodes = [] as Node[];
    nodes.push(getNode("All right Jim your quarterlies look very good."));
    nodes.push(getNode("How the thing is going at the library?"));
    nodes.push(getNode("Oh I told you couldn't closet so"));
    nodes.push(getNode("So you've come to themaster for guidance?"));

    expect(findAllMatches(nodes, "wassup")).toEqual([]);
  });

  it("misdirect #1", () => {
    const nodes = [] as Node[];
    nodes.push(getNode("1 2 3"));
    nodes.push(getNode("1 2 3 4"));

    const text = "1 2 3 4";
    const out: snippetRaw[] = [{ start: 1, end: 1, text }];

    expect(findAllMatches(nodes, text)).toEqual(out);
  });
});

// describe("findInSeason", () => {});
