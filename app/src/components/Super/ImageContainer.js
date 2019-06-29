import React, { Component } from 'react';
import { withStyles, Button } from '@material-ui/core';
import Image from '@material-ui/icons/Image';
import ImageCard from './ImageCard';
import Container from '../shared/Container';
import Item from '../shared/Item';

const fs = require('fs');
const path = require('path');

const IMGS_FOLDER = path.join('./', __dirname, 'public', 'imgs');

const styles = theme => ({
  root: {
    flexGrow: 1
  },
});

class ImageContainer extends Component {
  state = {
    imageName: null,
    file: null
  }

  handleOnChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const fileName = path.basename(e.target.files[0].path);
      const fileDestination = path.join(IMGS_FOLDER, fileName);
      const file = e.target.files[0];

      fs.copyFile(file.path, fileDestination, (err) => {
        if (err) console.log("Err", err);
        this.setState({
          fileName: fileName,
          file: file
        }, () => console.log(path.join(IMGS_FOLDER, this.state.fileName)));
      })
    }
  }

  render() {
    const {classes} = this.props;

    return (
      <div>
        <Container>
          <Item xs={12} align="center">
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
          </Container>

          <ImageCard 
            fileName={this.state.fileName}
            file={this.state.file}
          />
        
      </div>
    );
  }
}

export default withStyles(styles)(ImageContainer);
