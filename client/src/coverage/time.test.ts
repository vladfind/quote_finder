import { stringToSeconds } from "../Table/Scripts";
describe("time", () => {
  it("stringToseconds", () => {
    expect(stringToSeconds("0:00")).toBe(0);
    expect(stringToSeconds("0:10")).toBe(10);
    expect(stringToSeconds("1:00")).toBe(60);
    expect(stringToSeconds("2:00")).toBe(120);
    expect(stringToSeconds("1:01")).toBe(61);
  });
});
