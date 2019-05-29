import colors from './colors.js';

export const accountStates = [
  {
    label: 'Heeft besteld',
    description: 'Leden die in ieder geval 1 keer hebben besteld',
    key: 'ordered',
    predicate: account => !!account.first_order_date,
    color: colors[0],
  },
  {
    label: 'Geactiveerd',
    description: 'Leden die geactiveerd zijn na info avond',
    key: 'active',
    predicate: account => account.is_active,
    color: colors[1],
  },
  {
    label: 'Email Bevestigd',
    description: 'Leden die hun email bevestigd hebben',
    key: 'confirmed',
    predicate: account => !!account.confirmed_date,
    color: colors[2],
  },
  {
    label: 'Geregistreerd',
    description: 'Mensen die lid geworden zijn op website',
    key: 'created',
    predicate: account => true,
    color: colors[3],
  },
];

export function getAccountState(account) {
  for (const state of accountStates) {
    if (state.predicate(account)) {
      return state.key;
    }
  }
}
