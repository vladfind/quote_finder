import { useQuery } from "react-query";
import { Episode, snippet } from "../types";

const serverIP = "http://localhost:6002";

const fetchShows = async () => {
  const response = await fetch(`${serverIP}/shows`);
  if (!response.ok) {
    throw new Error("Network fail");
  }
  return response.json();
};

export const useShows = () => {
  return useQuery<string[]>(["shows"], () => fetchShows());
};

const fetchSnippets = async (show: string, text: string) => {
  const response = await fetch(`${serverIP}/data`, {
    body: JSON.stringify({ show, text }),
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (!response.ok) {
    throw new Error("Network fail");
  }
  return response.json();
};

export const useSnippets = (show: string, text: string) => {
  return useQuery<Episode[]>(["snippet", show, text], () =>
    fetchSnippets(show, text)
  );
};

const fetchScript = async (show: string, season: string, order: string) => {
  const response = await fetch(
    `${serverIP}/episode/${show}/${season}/${order}`
  );
  if (!response.ok) {
    throw new Error("Network fail");
  }
  return response.json();
};

export const useScript = (show: string, season: string, order: string) => {
  return useQuery<snippet[]>(["episode", show, season, order], () =>
    fetchScript(show, season, order)
  );
};
