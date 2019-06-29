import React, { Component } from 'react';
import { Grid, Paper, Typography, Button, Switch } from '@material-ui/core';
import { ClipLoader } from 'react-spinners';
import { withStyles } from '@material-ui/styles';
import axios from 'axios';
const path = require('path');

const Container = props => <Grid container {...props} />;
const Item = props => <Grid item {...props} />;

const imgStyle = {
  overflowX: 'auto',
  overflowY: 'auto',
  maxHeight: '400px'
}

const spinnerStyles =  {
  display: 'block',
  margin: 'auto auto',
  align: 'center',
  marginTop: '50px',
  borderColor: 'red'
}

const styles = theme => ({
  root: {
    flexGrow: 1
  },
  paper: {
    // padding: theme.spacing(1),
    textAlign: 'center',
    // color: theme.palette.text.secondary,
  },
});

class ImageCard extends Component {

  state = {
    fileName: null,
    file: null,
    convertedImage: null,
    resizedImage: null,
    converting: false,
    compareResize: true
  }

  uploadHandler = () => {
    const formData = new FormData()
    formData.append(
      'image',
      this.state.file,
      this.state.file.name
    )
    this.setState({
      converting: true
    });

    axios.post('http://localhost:9000/super', formData)
    .then(res => {
      console.log('Res', res)
      this.setState({
        convertedImage: res.data,
      })
      axios.post('http://localhost:9000/super-resize', formData)
      .then(res => {
        this.setState({
          resizedImage: res.data,
          converting: false
        })
      })
      .catch(err => console.log("Resize err", err));
    })
    .catch(err => console.log("Super Err", err));
  }

  toggleResize = () => {
    this.setState({
      compareResize: !this.state.compareResize
    })
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.fileName !== prevState.fileName) {
      return {
        fileName: nextProps.fileName,
        file: nextProps.file,
        convertedImage: null,
        resizedImage: null,
        converting: false
      }
    }

    return {
      ...prevState
    }
  }
  
  render() {
    const { compareResize, fileName,
      convertedImage, resizedImage, converting } = this.state;
    const { classes } = this.props;

    return (
      <React.Fragment>
      {
        fileName && (
          <React.Fragment>
            <Container spacing={1} align='center'>
              <Item xs={12}>
                <img style={imgStyle} src={`/imgs/${fileName}`} alt="Converted"/>
              </Item>

              <Item xs={12}>
                <Container align="center">
                  <Item xs={12}>
                    <Typography variant="caption" gutterBottom align='center'>
                      Compare Resize
                    </Typography>
                    <Switch checked={compareResize} onClick={this.toggleResize} />
                  </Item>
                  <Item xs={12}>
                    <Button
                      disabled={this.state.fileName == null}
                      onClick={this.uploadHandler}
                      variant="outlined" 
                      size="medium" 
                      color="primary" className={classes.margin}>
                      Superify
                    </Button>
                  </Item>
                </Container>
              </Item>
            </Container>

            {
              compareResize ? (
                <Container>
                  <Item xs={12} sm={6}>
                    {
                      converting ?
                        <ClipLoader
                          css={spinnerStyles}
                          sizeUnit={"px"}
                          size={150}
                          color={'#123abc'}
                          loading={true} />
                      :
                        convertedImage && (
                          <Paper className={classes.paper}>
                            <Item xs={12}>
                              <img style={imgStyle} src={`data:image/png;base64,${convertedImage}`}  alt="Converted"/>
                            </Item>
                            <Item xs={12}>
                              <Typography variant="h4" gutterBottom align='center'>
                                Superified Image
                              </Typography>
                            </Item>
                          </Paper>
                        )
                    }
                  </Item>
                  <Item xs={12} sm={6}>
                    {
                      converting ?
                        <ClipLoader
                          css={spinnerStyles}
                          sizeUnit={"px"}
                          size={150}
                          color={'#123abc'}
                          loading={true} />
                      :
                        resizedImage && (
                          <Paper className={classes.paper}>
                            <Item xs={12}>
                              <img style={imgStyle} src={`data:image/png;base64,${resizedImage}`}  alt="Converted"/>
                            </Item>
                            <Item xs={12}>
                              <Typography variant="h4" gutterBottom align='center'>
                                Resized Image
                              </Typography>
                            </Item>
                          </Paper>
                        )
                    }
                  </Item>
                </Container>
            ) : 
              <Container>
                <Item xs={12}>
                  {
                    converting ?
                      <ClipLoader
                        css={spinnerStyles}
                        sizeUnit={"px"}
                        size={150}
                        color={'#123abc'}
                        loading={true} />
                    :
                      convertedImage && (
                        <Paper className={classes.paper}>
                          <Item xs={12}>
                            <img style={imgStyle} src={`data:image/png;base64,${convertedImage}`}  alt="Converted"/>
                          </Item>
                          <Item xs={12}>
                            <Typography variant="h4" gutterBottom align='center'>
                              Superified Image
                            </Typography>
                          </Item>
                        </Paper>
                      )
                  }
                </Item>
              </Container>
            }
          </React.Fragment>
        )
      }
      </React.Fragment>
    );
  }
}

export default withStyles(styles)(ImageCard);