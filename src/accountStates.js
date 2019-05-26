export const accountStates = [
  {
    label: 'Ordered',
    key: 'ordered',
    predicate: account => !!account.first_order_date,
  },
  {
    label: 'Active',
    key: 'active',
    predicate: account => account.is_active,
  },
  {
    label: 'Confirmed',
    key: 'confirmed',
    predicate: account => !!account.confirmed_date,
  },
  {
    label: 'Registered',
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
