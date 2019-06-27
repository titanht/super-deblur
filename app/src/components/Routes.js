import React from 'react'
import { Route, Switch } from 'react-router-dom';
import Home from './Home/Home';
import SR from './Super/SR';
import DeblurRouter from './Deblur/DeblurRouter';

export default function Routes() {
  return (
    <Switch>
      <Route path="/" exact component={Home} />
      <Route path="/deblur" exact component={DeblurRouter} />
      <Route path="/super" exact component={SR} />
    </Switch>
  )
}
