import fs from "fs";
import { getEpisodeNameFromSTR } from "../src/files/files";

describe("files", () => {
  it("get episode name #1", () => {
    const fileName = "The Office - 1x01 - Pilot.en.srt";
    const episodeName = "Pilot";
    expect(getEpisodeNameFromSTR(fileName)).toBe(episodeName);
  });
  it("get episode name #2 (with a dot)", () => {
    const fileName = "The Flash 2014  - 1x08 - Flash vs. Arrow.HDTV.LOL.en.srt";
    const episodeName = "Flash vs. Arrow";
    expect(getEpisodeNameFromSTR(fileName)).toBe(episodeName);
  });
});
