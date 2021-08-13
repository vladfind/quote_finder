import {
  Button,
  CardHeader,
  createStyles,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  IconButton,
  makeStyles,
  Typography,
} from "@material-ui/core";
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Episode, snippet } from "../types";
import { Close as CloseIcon } from "@material-ui/icons";

export const stringToSeconds = (text: string) => {
  const timeParts = text.split(":");
  switch (timeParts.length) {
    case 1:
      return Number(timeParts[0]);
    case 2: {
      const minutes = Number(timeParts[0]) * 60;
      const seconds = Number(timeParts[1]);
      return seconds + minutes;
    }
    case 3: {
      const hours = Number(timeParts[0]) * 60 * 60;
      const minutes = Number(timeParts[1]) * 60;
      const seconds = Number(timeParts[2]);
      return seconds + minutes + hours;
    }
    default:
      return Number(timeParts[0]);
  }
};

export interface ScriptProps {
  /**
   * The full episode
   */
  episode: Episode;
  /**
   * The snippets of found text
   */
  script: snippet[];
  onClose: () => void;
}

const useStyles = makeStyles((theme) =>
  createStyles({
    timeStart: {
      paddingRight: theme.spacing(1) / 2,
    },
    text: {
      color: theme.palette.text.primary,
      flexGrow: 1,
      paddingLeft: theme.spacing(1) / 2,
      paddingRight: theme.spacing(1) / 2,
    },
    textShow: {
      color: theme.palette.getContrastText(theme.palette.info.main),
      background: theme.palette.info.main,
      paddingLeft: theme.spacing(1) / 2,
      paddingRight: theme.spacing(1) / 2,
      flexGrow: 1,
    },
    timeEnd: {
      paddingLeft: theme.spacing(1) / 2,
    },
  })
);
export const Script: React.FC<ScriptProps> = ({ episode, script, onClose }) => {
  const classes = useStyles();
  const { name, season, order, snippets } = episode;
  const focusRef = useRef<null | HTMLParagraphElement>(null);
  const [focus, setFocus] = useState(0);

  const included = useMemo(() => {
    return script.filter((node) => {
      for (const snippet of snippets) {
        if (
          stringToSeconds(node.start) >= stringToSeconds(snippet.start) &&
          stringToSeconds(node.end) <= stringToSeconds(snippet.end)
        ) {
          return true;
        }
      }
      return false;
    });
  }, [snippets, script]);

  const nextFocus = () => {
    if (included.length === 1) {
      focusRef.current?.scrollIntoView({ behavior: "smooth" });
      return;
    }
    const next = focus + 1;
    if (next > included.length - 1) {
      setFocus(0);
    } else {
      setFocus(next);
    }
  };

  const prevFocus = () => {
    if (included.length === 1) {
      focusRef.current?.scrollIntoView({ behavior: "smooth" });
      return;
    }
    const next = focus - 1;
    if (next < 0) {
      setFocus(included.length - 1);
    } else {
      setFocus(next);
    }
  };

  const myRef = useCallback((node: HTMLParagraphElement) => {
    focusRef.current = node;
    focusRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  return (
    <Dialog open={true} maxWidth="xl" onClose={onClose}>
      {/* <DialogTitle disableTypography> */}
      <CardHeader
        title={name}
        subheader={`S${season}E${order}`}
        action={
          <IconButton title="Close" onClick={onClose}>
            <CloseIcon />
          </IconButton>
        }
      />
      <DialogContent dividers>
        <DialogContentText component="div">
          {script.map((snippet, idx) => {
            const { text, start, end } = snippet;
            const findIndex = included.findIndex((node) => node === snippet);

            const isShow = findIndex !== -1;
            return (
              <div style={{ display: "flex" }} key={idx}>
                <div className={classes.timeStart}>{start}</div>
                {/* {isShow && <a style={{ display: "none" }} href={`#${idx}`}></a>} */}
                {isShow && findIndex === focus && (
                  <Typography
                    variant="body1"
                    className={classes.textShow}
                    ref={myRef}
                  >
                    {text}
                  </Typography>
                )}
                {isShow && findIndex !== focus && (
                  <Typography variant="body1" className={classes.textShow}>
                    {text}
                  </Typography>
                )}
                {!isShow && (
                  <Typography variant="body1" className={classes.text}>
                    {text}
                  </Typography>
                )}

                <div className={classes.timeEnd}>{end}</div>
              </div>
            );
          })}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={prevFocus}>Previous</Button>
        <Button onClick={nextFocus}>Next</Button>
      </DialogActions>
    </Dialog>
  );
};
