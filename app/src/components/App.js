import React, { Component } from 'react';
import { MemoryRouter } from 'react-router-dom';
import Routes from './Routes';

class App extends Component {
  render() {
    return (
      <div>
        <MemoryRouter>
          <Routes />
        </MemoryRouter>
      </div>
    );
  }
}

export default App;