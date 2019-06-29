import React, { useState } from 'react';

import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import { VideoCall, Image } from '@material-ui/icons';
import { withStyles } from '@material-ui/core';

import { Link } from 'react-router-dom';
import Container from '../shared/Container';
import Item from '../shared/Item';
import SRVideo from './SRVideo';
import ImageContainer from './ImageContainer';

const styles = theme => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper
  },
  tabContent: {
    padding: theme.spacing(2)
  },
  tab: {
    padding: theme.spacing(2)
  }
});

const SRRouter = withStyles(styles)(({classes}) => {
  const [tabs, setTabs] = useState([
    {
      active: true,
      label: 'Image',
      content: <ImageContainer />,
      icon: <Image />
    },
    {
      active: false,
      label: 'Video',
      content: <SRVideo />,
      icon: <VideoCall />
    },
  ]);

  const onChange = (e, value) => {
    setTabs(
      tabs
        .map(tab => ({ ...tab, active: false }))
        .map((tab, index) => ({
          ...tab,
          active: index === value
        }))
    );
  };

  const active = tabs.findIndex(tab => tab.active);
  const content = tabs[active].content;

  return (
    <div className={classes.root}>
      <Link to="/">
        <img src="/assets/back.png" height="40px" alt="Back" />
      </Link>
      <Container justify="center">
        <Item xs={12}>
          <Typography variant="h2" gutterBottom align='center'>
            Super Resolution
          </Typography>
        </Item>
      </Container>
      <Tabs 
        value={active}
        onChange={onChange} 
        indicatorColor="secondary"
        textColor="secondary"
        centered>
        {tabs
          .filter(tab => !tab.hidden)
          .map(tab => (
            <Tab
              className={classes.tab}
              key={tab.label}
              disabled={tab.disabled}
              icon={tab.icon}
              label={tab.label}
              textColor='primary'
            />
          ))}
      </Tabs>
      <Typography component="div" className={classes.tabContent}>
        {content}
      </Typography>
    </div>
  );
}
)

export default SRRouter;