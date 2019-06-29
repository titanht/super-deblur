import React, { Component } from 'react';
import axios from 'axios';
import { Grid, Paper, withStyles, Typography, Switch, Button } from '@material-ui/core';
import { ClipLoader } from 'react-spinners';
import Image from '@material-ui/icons/Image';
const fs = require('fs');
const path = require('path');

const IMGS_FOLDER = path.join('./', __dirname, 'public', 'imgs');


const styles = theme => ({
  root: {
    flexGrow: 1
  },
  paper: {
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
  },
  input: {
    display: 'none'
  },
  button: {
    margin: theme.spacing(1),
  },
  rightIcon: {
    marginLeft: theme.spacing(1),
  },
  margin: {
    margin: theme.spacing(1),
  },
});

const spinnerStyles =  {
  display: 'block',
  margin: 'auto auto',
  align: 'center',
  marginTop: '50px',
  borderColor: 'red'
}

const imgStyle = {
  overflowX: 'auto',
  overflowY: 'auto',
  maxHeight: '400px'
}

const Container = props => <Grid container {...props} />;
const Item = props => <Grid item {...props} />;

class SRImage extends Component {
  state = {
    file: null,
    fileName: '',
    img: null,
    resizedImg: null,
    converting: false,
    compareResize: true
  }

  uploadHandler = () => {
    const formData = new FormData()
    console.log(this.state.file)
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
        img: res.data,
      })
      axios.post('http://localhost:9000/super-resize', formData)
      .then(res => {
        this.setState({
          resizedImg: res.data,
          converting: false
        })
      })
      .catch(err => console.log("Resize err", err));
    })
    .catch(err => console.log("Super Err", err));
  }

  handleOnChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      this.setState({
        ...this.state,
        file: e.target.files[0]
      }, () => {
        const fileName = path.basename(this.state.file.path);
        const fileDestination = path.join(IMGS_FOLDER, fileName);
        
        fs.copyFile(this.state.file.path, fileDestination, (err) => {
          if (err) console.log("Err", err);
          console.log("COpied");
          this.setState({
            fileName: fileName,
            img: null,
            resizedImg: null
          }, () => console.log(path.join(IMGS_FOLDER, this.state.fileName)));
        })
      });
    }
  }

  toggleResize = () => {
    this.setState({
      compareResize: !this.state.compareResize
    })
  }

  render() {
    const {classes} = this.props;

    return (
      <div>
        <Container>
          <Item xs={6} align="right">
            <input
              accept="image/*"
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
                <Image className={classes.rightIcon} />
              </Button>
            </label>
          </Item>

          <Item xs={6}>
              <Container align="left">
                <Item xs={12}>
                  <Button 
                    disabled={this.state.file == null}
                    onClick={this.uploadHandler}
                    variant="outlined" 
                    size="medium" 
                    color="primary" className={classes.margin}>
                    Superify
                  </Button>
                </Item>
                <Item xs={12}>
                  <Typography variant="caption" gutterBottom align='center'>
                    Compare Resize
                  </Typography>
                  <Switch checked={this.state.compareResize} onClick={this.toggleResize} />
                </Item>
              </Container>
            </Item>
          </Container>

        <Container spacing={1} align='center'>
          <Item xs={12}>
            {
              (this.state.file && this.state.fileName) && (
                <img style={imgStyle} src={`/imgs/${this.state.fileName}`} alt="Converted"/>
              )
            }    
          </Item>
        </Container>
        {
          this.state.compareResize ? (
            <Container>
              <Item xs={12} sm={6}>
                {
                  this.state.converting ?
                    <ClipLoader
                      css={spinnerStyles}
                      sizeUnit={"px"}
                      size={150}
                      color={'#123abc'}
                      loading={this.state.loading} />
                  :
                    this.state.img && (
                      <Paper className={classes.paper}>
                        <Item xs={12}>
                          <img style={imgStyle} src={`data:image/png;base64,${this.state.img}`}  alt="Converted"/>
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
                  this.state.converting ?
                    <ClipLoader
                      css={spinnerStyles}
                      sizeUnit={"px"}
                      size={150}
                      color={'#123abc'}
                      loading={this.state.loading} />
                  :
                    this.state.img && (
                      <Paper className={classes.paper}>
                        <Item xs={12}>
                          <img style={imgStyle} src={`data:image/png;base64,${this.state.resizedImg}`}  alt="Converted"/>
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
                this.state.converting ?
                  <ClipLoader
                    css={spinnerStyles}
                    sizeUnit={"px"}
                    size={150}
                    color={'#123abc'}
                    loading={this.state.loading} />
                :
                  this.state.img && (
                    <Paper className={classes.paper}>
                      <Item xs={12}>
                        <img style={imgStyle} src={`data:image/png;base64,${this.state.img}`}  alt="Converted"/>
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

        
      </div>
    );
  }
}

export default withStyles(styles)(SRImage);
