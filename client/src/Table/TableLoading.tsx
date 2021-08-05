import React from "react";
import { TableEntryLoading } from "./TableEntryLoading";

export const TableLoading: React.FC = () => {
  return (
    <>
      {new Array(10).fill(0).map((_, idx) => {
        return (
          <React.Fragment key={idx}>
            <TableEntryLoading />
            <br />
          </React.Fragment>
        );
      })}
    </>
  );
};
