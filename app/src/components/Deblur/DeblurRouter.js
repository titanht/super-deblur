import React, { useState } from 'react';

import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import { VideoCall, Image } from '@material-ui/icons';
import { withStyles } from '@material-ui/core';
import Deblur from './Deblur';

const styles = theme => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper
  },
  tabContent: {
    padding: theme.spacing(2)
  }
});

const RenderingTabsBasedOnState = withStyles(styles)(({classes}) => {
  const [tabs, setTabs] = useState([
    {
      active: true,
      label: 'Image',
      content: <Deblur />,
      icon: <Image />
    },
    {
      active: false,
      label: 'Video',
      content: 'Video convert',
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
      <Tabs value={active} onChange={onChange} centered>
        {tabs
          .filter(tab => !tab.hidden)
          .map(tab => (
            <Tab
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

export default RenderingTabsBasedOnState;