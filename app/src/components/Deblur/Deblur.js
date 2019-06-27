import React, { Component } from 'react';
import axios from 'axios';
import { Grid, Paper, withStyles, Typography, Input } from '@material-ui/core';
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

class Deblur extends Component {
  state = {
    file: null,
    fileName: '',
    img: null,
    converting: false
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
            fileName: fileName
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
    axios.post('http://localhost:5000/deblur', formData)
    .then(res => {
      console.log('Res', res)
      this.setState({
        img: res.data,
        converting: false
      })
    })
    .catch(err => console.log("Err", err));
  }

  render() {
    const {classes} = this.props;

    return (
      <div>
        <Link to="/">Back</Link>
        <Container justify="center">
          <Item xs={12}>
            <Typography variant="h2" gutterBottom align='center'>
              Image Deblur
            </Typography>
          </Item>
        </Container>

        <Container spacing={4}>
          <Item xs={12}>
            <Container>
              <Item xs={12}>
                <Paper className={classes.paper}>
                  <Input type="file" onChange={this.handleOnChange} />
                  <button 
                    disabled={this.state.file == null}
                    className="btn btn-outline-info"
                    onClick={this.uploadHandler}>
                    Deblur
                  </button>
                </Paper>
              </Item>
            </Container>
          </Item>
        </Container>

        <Container spacing={1} align='center'>
          <Item xs={12} sm={6}>
            {
              (this.state.file && this.state.fileName) && (
                <Paper className={classes.paper}>
                  <img style={imgStyle} src={`/imgs/${this.state.fileName}`} alt="Converted"/>
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
                    <img style={imgStyle} src={`data:image/png;base64,${this.state.img}`}  alt="Converted"/>
                  </Paper>
                )
            }
          </Item>
        </Container>
      </div>
    );
  }
}

export default withStyles(styles)(Deblur);