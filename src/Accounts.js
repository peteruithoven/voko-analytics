import React from 'react';
import { useFetch } from 'react-fetch-hook';
import { VictoryPie } from 'victory';
import styled from 'styled-components';

const Container = styled.div`
  display: flex;
`;

function Accounts() {
  const { isLoading, data } = useFetch('data/accounts.json');
  if (isLoading || !data) return 'Loading...';
  console.log('accounts data: ', data);
  const numActive = data.filter(account => account.is_active).length;
  const isActiveData = [
    {
      x: 'active',
      y: numActive,
    },
    {
      x: 'inactive',
      y: data.length - numActive,
    },
  ];
  const numSleeping = data.filter(account => account.is_asleep).length;
  console.log('numSleeping: ', numSleeping);
  console.log('data.length');

  const isSleepingData = [
    {
      x: 'sleeping',
      y: numSleeping,
    },
    {
      x: 'not sleeping',
      y: data.length - numSleeping,
    },
  ];
  return (
    <Container>
      <VictoryPie data={isActiveData} />
      <VictoryPie data={isSleepingData} />
    </Container>
  );
}

export default Accounts;
