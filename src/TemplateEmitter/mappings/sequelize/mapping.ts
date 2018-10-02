export const values = {
  Boolean : {
      defaultValue: false,
      type: 'BOOLEAN',
  },
  DateTime: {
      defaultValue: undefined,
      type: 'DATE',
  },
  Decimal: {
      defaultValue: 0,
      type: 'DECIMAL'
  },
  Integer: {
      defaultValue: 0,
      type: 'INTEGER',
  },
  String : {
      defaultValue: '\'\'',
      type: 'STRING',
  },
  UniqueIdentifier: {
    defaultValue: 'Sequelize.UUIDV4',
    type: 'UUID'
  }
}
