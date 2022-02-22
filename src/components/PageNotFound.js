import React from "react";
import Grid from "@material-ui/core/Grid";
import Zoom from "@mui/material/Zoom";
import Paper from "@mui/material/Paper";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import { CardActionArea } from "@mui/material";

const PageNotFound = (props) => {
  const icon = (
    <Paper elevation={24}>
      <Card sx={{ maxWidth: 345 }}>
        <CardMedia
          component="img"
          height="140"
          image="https://wallpaperaccess.com/full/6285265.jpg"
          alt="green iguana"
        />
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
            404 Error
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Sorry! Page Not Found. Please check the url you are requesting.
          </Typography>
        </CardContent>
      </Card>
    </Paper>
  );
  return (
    <Grid
      container
      spacing={0}
      direction="column"
      alignItems="center"
      justify="center"
      style={{ minHeight: "85vh", marginTop: "5vh" }}
    >
      <Grid item xs={5}>
        <Zoom in={true}>{icon}</Zoom>
      </Grid>
    </Grid>
  );
};

export default PageNotFound;
