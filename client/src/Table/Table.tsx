import { LinearProgress } from "@material-ui/core";
import { Alert } from "@material-ui/lab";
import { time } from "console";
import React from "react";
import { useSnippets } from "../API/fetch";
import { AlertBase } from "../components/AlertBase";
import { NetworkFail } from "../components/NetworkFail";
import { Episode } from "../types";
import { Script } from "./Scripts";
import { TableEntry } from "./TableEntry";
import { TableLoading } from "./TableLoading";

const examples: Episode[] = [
  {
    season: "1",
    order: "1",
    name: "Hello",
    snippets: [
      { text: "i dont know", end: "10", start: "0" },
      { text: "i dont know", end: "0", start: "0" },
    ],
  },
  {
    season: "1",
    order: "5",
    name: "The second hello",
    snippets: [{ text: "i dont know you", end: "0", start: "0" }],
  },
];

interface props {
  show: string;
  text: string;
}

export const Table2: React.FC<props> = ({ show, text }) => {
  const { data, isError, isLoading } = useSnippets(show, text);

  return (
    <>
      {isLoading && (
        <>
          <br />
          <LinearProgress />
          <br />
        </>
      )}
      {isError && <NetworkFail />}
      {data && data.length === 0 && (
        <AlertBase
          marginTop={true}
          marginBottom={true}
          type="warning"
          text="Nothing was found"
        ></AlertBase>
      )}
      {data?.map((episode, idx) => (
        <React.Fragment key={idx}>
          <TableEntry show={show} episode={episode} />
        </React.Fragment>
      ))}
      {(isLoading || data === undefined) && <TableLoading />}
    </>
  );
};
export const Table = React.memo<props>(Table2);
