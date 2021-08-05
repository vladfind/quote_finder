import { AppBar, IconButton, Toolbar, Typography } from "@material-ui/core";

export const Navbar: React.FC = () => {
  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6">The Quote Finder</Typography>
      </Toolbar>
    </AppBar>
  );
};
