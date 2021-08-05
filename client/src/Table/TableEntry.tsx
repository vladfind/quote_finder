import {
  makeStyles,
  createStyles,
  Card,
  CardHeader,
  Avatar,
  CardContent,
  Typography,
  Box,
  Grid,
  Button,
  Dialog,
} from "@material-ui/core";
import { useState } from "react";
import { Episode } from "../types";
import { ScriptProvider } from "../comp/ScriptProvider";
interface entryProps {
  show: string;
  episode: Episode;
}

const useEntryStyles = makeStyles((theme) =>
  createStyles({
    snippet: {
      backgroundColor: theme.palette.action.hover,
      padding: theme.spacing(1),
      borderLeft: `${theme.spacing(1) / 2}px solid ${theme.palette.info.light}`,
    },
    caption: {
      paddingTop: theme.spacing(1) / 2,
    },
  })
);

export const TableEntry: React.FC<entryProps> = ({ show, episode }) => {
  const classes = useEntryStyles();
  const { season, order, name, snippets } = episode;
  const [open, setOpen] = useState(false);

  return (
    <Card>
      <CardHeader
        title={name}
        subheader={`S${season}E${order}`}
        avatar={<Avatar>{order}</Avatar>}
      />
      <CardContent>
        {open && (
          <ScriptProvider
            show={show}
            episode={episode}
            onClose={() => setOpen(false)}
          />
        )}
        {/* <Script></Script> */}
        <Typography>Matches: </Typography>
        {snippets.map((snippet, idx) => {
          const { start, end, text } = snippet;
          return (
            <Box key={idx}>
              <Typography className={classes.snippet}>{text}</Typography>
              <Grid container justifyContent="space-between">
                <Grid item>
                  <Typography variant="caption" className={classes.caption}>
                    Time: {start} - {end}
                  </Typography>
                </Grid>
                <Grid item onClick={() => setOpen(true)}>
                  <Button>Open</Button>
                </Grid>
              </Grid>

              <br />
              <br />
            </Box>
          );
        })}
      </CardContent>
    </Card>
  );
};
