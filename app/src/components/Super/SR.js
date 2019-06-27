import React, { Component } from 'react';
import axios from 'axios';
import { Grid, Paper, withStyles, Typography, Switch } from '@material-ui/core';
import { ClipLoader } from 'react-spinners';
import { Link } from 'react-router-dom';
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

class SR extends Component {
  state = {
    file: null,
    fileName: '',
    img: null,
    resizedImg: null,
    converting: false,
    compareResize: true,
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

  toggleResize = () => {
    this.setState({
      compareResize: !this.state.compareResize
    })
  }

  render() {
    const {classes} = this.props;

    return (
      <div>
        <Link to="/">Back</Link>
        <Container justify="center">
          <Item xs={12}>
            <Typography variant="h2" gutterBottom align='center'>
              Super Resolution
            </Typography>
          </Item>
        </Container>

        <Container spacing={3}>
          <Item xs={6}>
            <Container align="right">
              <Item xs={12}>
                <input type="file" onChange={this.handleOnChange} />
              </Item>
              <Item xs={12}>
                <Typography variant="caption" gutterBottom align='center'>
                  Compare Resize
                </Typography>
                <Switch checked={this.state.compareResize} onClick={this.toggleResize} />
              </Item>
            </Container>
          </Item>
          <Item xs={6} align="left">
            <button 
              disabled={this.state.file == null}
              className="btn btn-outline-info"
              onClick={this.uploadHandler}>
              Superify
            </button>
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

export default withStyles(styles)(SR);
