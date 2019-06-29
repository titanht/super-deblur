import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import {withStyles} from '@material-ui/core';
import Item from '../shared/Item';
import Container from '../shared/Container';
import ImageCard from '../shared/ImageCard';

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

  componentDidMount() {
    this.props.history.push('/super')
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
      </div>
    );
  }
}

export default withStyles(styles)(Home);