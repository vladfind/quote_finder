import { convertMsToTime } from "../src/files/files";

describe("time", () => {
  it("seconds", () => {
    expect(convertMsToTime(1000)).toBe("0:01");
    expect(convertMsToTime(10000)).toBe("0:10");
    expect(convertMsToTime(160793)).toBe("2:40");
  });
  it("minutes", () => {
    expect(convertMsToTime(60 * 1000)).toBe("1:00");
    expect(convertMsToTime(61 * 1000)).toBe("1:01");
    expect(convertMsToTime(70 * 1000)).toBe("1:10");

    expect(convertMsToTime(15 * 1000 * 60 + 10 * 1000)).toBe("15:10");
    expect(convertMsToTime(909719)).toBe("15:09");
  });
  it("hours", () => {
    expect(convertMsToTime(60 * 60 * 1000)).toBe("1:00:00");
    expect(convertMsToTime(61 * 60 * 1000)).toBe("1:01:00");
    expect(convertMsToTime(71 * 60 * 1000)).toBe("1:11:00");
  });
});
