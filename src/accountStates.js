export const accountStates = [
  {
    label: 'Heeft besteld',
    key: 'ordered',
    predicate: account => !!account.first_order_date,
  },
  {
    label: 'Geactiveerd',
    key: 'active',
    predicate: account => account.is_active,
  },
  {
    label: 'Email Bevestigd',
    key: 'confirmed',
    predicate: account => !!account.confirmed_date,
  },
  {
    label: 'Geregistreerd',
    key: 'created',
    predicate: account => true,
  },
];

export function getAccountState(account) {
  for (const state of accountStates) {
    if (state.predicate(account)) {
      return state.key;
    }
  }
}
