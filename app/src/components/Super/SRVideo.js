import React, { Component } from 'react';
import { withStyles } from '@material-ui/styles';
import Container from '../shared/Container';
import Item from '../shared/Item';
import { Button } from '@material-ui/core';
import { VideoCall } from '@material-ui/icons';
import captureVideoFrame from 'capture-video-frame';
import Cropper from 'react-cropper';
import path from 'path';
import fs from 'fs';

import 'cropperjs/dist/cropper.css';

const styles = theme => ({
  root: {
    flexGrow: 1
  },
});

const VIDEOS_FOLDER = path.join('./', __dirname, 'public', 'videos');

class SRVideo extends Component {

  state = {
    img: null,
    videoPath: null,
    croppedImage: null,
    cropped: false
  }

  crop = () => {
    this.setState({
      croppedImage: this.refs.cropper.getCroppedCanvas().toDataURL()
    })
  }

  handleOnChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      this.setState({
        img: null,
        croppedImage: null,
        cropped: false
      })
      // console.log(e.target.files[0]);
      // this.setState({
      //   videoPath: e.target.files[0].path
      // })
      const fileName = path.basename(e.target.files[0].path);
      const fileDestination = path.join(VIDEOS_FOLDER, fileName);
      
      fs.copyFile(e.target.files[0].path, fileDestination, (err) => {
        if (err) console.log("Err", err);
        console.log("COpied");
        this.setState({
          videoPath: 'videos/' + fileName
        }, () => console.log(this.state.videoPath));
      })
    }
  }

  handleCapture = () => {
    const frame = captureVideoFrame('my-video', 'png')
    document.getElementById('my-video').pause();
    this.setState({
      img: frame.dataUri
    })
  }

  handleCrop = () => {
    this.setState({
      img: null,
      cropped: true
    })
  }

  render() {
    const {classes} = this.props;

    return (
      <div className={classes.root}>
        <Container spacing={3}>

          <Item xs={12} align="center">
            <input
              accept="video/*"
              onChange={this.handleOnChange}
              className={classes.input}
              style={{display: 'none'}}
              id="outlined-button-file"
              multiple
              type="file"
            />
            <label htmlFor="outlined-button-file">
              <Button variant="contained" component="span" color="primary" className={classes.button}>
                Upload
                <VideoCall className={classes.rightIcon} />
              </Button>
            </label>
          </Item>
        </Container>

        {
          this.state.videoPath && (
            <Container align="center">
              <Item xs={12}>
                <video ref="my-vid" 
                style={{width: '60%'}} id="my-video" 
                src={this.state.videoPath} 
                controls>
                </video>
              </Item>
              <Item xs={12}>
                <Button color="primary" variant="contained" onClick={this.handleCapture}>Capture Frame</Button>
              </Item>
            </Container>
          )
        }

        {
          this.state.img && (
            <Container>
              <Item sm={12}>
                <Cropper
                  ref='cropper'
                  src={this.state.img}
                  style={{height: 400, width: '100%'}}
                  // Cropper.js options
                  aspectRatio={1/1}
                  guides={false}
                  crop={this.crop} 
                  />
              </Item>
              <Item sm={12}>
                <Button color="default" variant="contained"
                  onClick={this.handleCrop}>
                  Crop Image
                </Button>
              </Item>
            </Container>
          )
        }

        {
          this.state.cropped && (
            <Container>
              <Item sm={12}>
                <img src={this.state.croppedImage} alt="Cropped" />
              </Item>
            </Container>
          )
        }

      </div>
    );
  }
}

export default withStyles(styles)(SRVideo);