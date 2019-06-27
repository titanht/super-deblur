import React, { Component } from 'react';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core';

const styles = theme => ({
  card: {
    maxWidth: 322
  },
  media: {
    width: 322,
    height: 322
  }
});

class ImageCard extends Component {
  render() {
    const {classes, image, title} = this.props;

    return (
      <div>
        <Card className={classes.card}>
          <CardMedia
            className={classes.media}
            image={image}
            title="Grapefruit"
          />
          <CardContent>
            <Typography variant='h4'>{title}</Typography>
          </CardContent>
        </Card>
      </div>
    );
  }
}

export default withStyles(styles)(ImageCard);