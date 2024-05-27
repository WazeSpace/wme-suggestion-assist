interface Date {
  addMilliseconds(ms: number): Date;
  addSeconds(seconds: number): Date;
  addMintues(minutes: number): Date;
  addHours(hours: number): Date;
  addDays(days: number): Date;
  addMonths(months: number): Date;
  addYears(years: number): Date;
}

type Manipulator =
  | string
  | [targetName: string, daysCount: number]
  | [targetName: string, getCurrentValueName: string, setValueName: string];
const manipulators: Manipulator[] = [
  'Milliseconds',
  'Seconds',
  'Minutes',
  'Hours',
  ['addDays', 'getDate', 'setDate'],
  ['addMonths', 30.4167],
  ['addYears', 365],
];

function setupManipulator(manipulator: Manipulator): void {
  if (typeof manipulator === 'string' || manipulator.length === 3) {
    const targetName =
      typeof manipulator === 'string' ? `add${manipulator}` : manipulator[0];
    const getCurrentName =
      typeof manipulator === 'string' ? `get${manipulator}` : manipulator[1];
    const setName =
      typeof manipulator === 'string' ? `set${manipulator}` : manipulator[2];

    Date.prototype[targetName] = function (this: Date, diff: number) {
      const current: number = this[getCurrentName]();
      const newValue = current + diff;
      const newTimestamp = this[setName](newValue);
      return new Date(newTimestamp);
    };
    return;
  }

  const [targetName, daysCount] = manipulator;
  Date.prototype[targetName] = function (this: Date, diff: number) {
    return this.addDays(Math.floor(daysCount * diff));
  };
}

manipulators.forEach(setupManipulator);
