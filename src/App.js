import React from 'react';
import Accounts from './Accounts.js';
import Orders from './Orders.js';
import { Container } from '@material-ui/core';

function App() {
  return (
    <Container maxWidth="lg">
      <Orders />
      <Accounts />
    </Container>
  );
}

export default App;
