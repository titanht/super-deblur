import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import {withStyles} from '@material-ui/core';
import Item from '../shared/Item';
import Container from '../shared/Container';
import ImageCard from '../shared/ImageCard';
import captureVideoFrame from 'capture-video-frame';

const styles = theme => ({
  root: {
    flexGrow: 1,
    marginTop: '10%',
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: 'center',
    color: theme.palette.text.secondary
  },
});

// const Container = props => <Grid container {...props} />;
// const Item = props => <Grid item {...props} />;

class Home extends Component {
  state={
    img: null
  }

  handleCapture = () => {
    console.log("Capture")
    var frame = captureVideoFrame('my-video', 'png')
    document.getElementById('my-video').pause();
    this.setState({
      img: frame.dataUri
    },() => console.log(this.state.img))
    console.log(frame)
  }

  render() {
    const {classes} = this.props;

    return (
      <div className={classes.root}>
        <Container spacing={2} align='center'>
          <Item xs={12} sm={6} >
            <Link to="/deblur" className="link">
              <ImageCard image="/imgs/1.png" title="Deblurring" />
            </Link>
          </Item>
          <Item xs={12} sm={6} >
            <Link to="/super" className="link">
              <ImageCard image="/imgs/2.png" title="Super Resolution" />
            </Link>
          </Item>
        </Container>
        <Container>
          {/* <video ref="my-vid" id="my-video" src="/videos/v.mp4" controls>

          </video>
          <Item>
            <Button onClick={this.handleCapture}>Capture Frame</Button>
          </Item>

          <Item sm={12}>
            {
              this.state.img && (
                <img  src={this.state.img}  alt="Converted"/>
              )
            }
          </Item> */}
        </Container>
      </div>
    );
  }
}

export default withStyles(styles)(Home);