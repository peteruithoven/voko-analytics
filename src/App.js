import React from 'react';
import { Container } from '@material-ui/core';
import Orders from './Orders.js';
import Accounts from './Accounts.js';

function App() {
  return (
    <Container maxWidth="lg">
      <Orders />
      <Accounts />
    </Container>
  );
}

export default App;
