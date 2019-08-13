import React, {Component} from 'react';
import {Router} from '@reach/router';
import {ThemeProvider} from 'styled-components';
import theme from './theme';

import Mastery from './Mastery';
import Home from './Home';

class App extends Component {
  render() {
    return (
      <ThemeProvider theme={theme}>
        <Router>
          <Mastery path="/mastery/:source/:subject" />
          <Mastery path="/mastery/:source" />
          <Home path="/" default />
        </Router>
      </ThemeProvider>
    );
  }
}
export default App;
