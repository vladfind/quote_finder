import { CircularProgress } from "@material-ui/core";
import { Script } from "../Table/Scripts";
import { useScript } from "../API/fetch";
import { AlertError } from "../components/AlertError";
import { NetworkFail } from "../components/NetworkFail";
import { Episode, snippet } from "../types";

interface props {
  show: string;
  episode: Episode;
  onClose: () => void;
}

export const ScriptProvider: React.FC<props> = ({ show, episode, onClose }) => {
  const { season, order } = episode;
  const { data, isError } = useScript(show, season, order);
  if (isError) {
    return <NetworkFail />;
  }
  if (data === undefined) {
    return <CircularProgress></CircularProgress>;
  }
  return <Script episode={episode} script={data} onClose={onClose} />;
};
