export interface snippetRaw {
  text: string;
  start: number;
  end: number;
}

export interface snippet {
  text: string;
  start: string;
  end: string;
}

export interface Episode {
  season: string;
  order: string;
  /**
   * Name of the episode
   */
  name: string;
  snippets: snippet[];
}
