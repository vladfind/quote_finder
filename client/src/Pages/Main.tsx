import {
  Button,
  CircularProgress,
  createStyles,
  InputAdornment,
  makeStyles,
  TextField,
} from "@material-ui/core";
import { Autocomplete } from "@material-ui/lab";
import { useState } from "react";
import { useShows } from "../API/fetch";
import { Table } from "../Table/Table";
import { TableLoading } from "../Table/TableLoading";

const useStyles = makeStyles((theme) =>
  createStyles({
    root: {
      margin: "0 auto",
      padding: theme.spacing(1),
      maxWidth: theme.breakpoints.values["md"],
    },
  })
);

export const Main: React.FC = () => {
  const { data: shows, isLoading } = useShows();
  const classes = useStyles();
  const [show, setShow] = useState<string | null>(null);
  const [text, setText] = useState("");

  const [showR, setShowR] = useState<string | null>(null);
  const [textR, setTextR] = useState<string | null>(null);

  const change = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (show && text) {
      setShowR(show);
      setTextR(text);
    }
  };
  return (
    <div className={classes.root}>
      <br />
      <form onSubmit={change}>
        <Autocomplete
          value={show}
          onChange={(e, nextVal) => setShow(nextVal)}
          options={shows ? shows : []}
          loading={isLoading}
          loadingText="Loading shows.."
          renderInput={(params) => (
            <TextField
              {...params}
              label="TV"
              variant="outlined"
              InputProps={{
                ...params.InputProps,
                endAdornment: (
                  <InputAdornment position="end">
                    {isLoading && <CircularProgress />}
                    {params.InputProps.endAdornment}
                  </InputAdornment>
                ),
              }}
            />
          )}
        />
        <br />
        <TextField
          label="Text to search"
          variant="outlined"
          fullWidth
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <br />
        <br />
        <Button
          type="submit"
          variant="contained"
          color="secondary"
          fullWidth
          size="large"
        >
          Find
        </Button>
      </form>

      <br />
      {showR && textR && <Table show={showR} text={textR} />}
    </div>
  );
};
