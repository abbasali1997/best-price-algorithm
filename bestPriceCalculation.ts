/**
 * Helper class to calculate the best pick of time periods
 */
class TimePeriods {
    timePeriodCombination: { days: number; quantity: number }[];

    constructor() {
        this.timePeriodCombination = [];
    }

    setCombination(timePeriodCombination: { days: number; quantity: number }[]) {
        this.timePeriodCombination = timePeriodCombination.map(ob => ({ ...ob }));
    }

    addDays(days: number) {
        if (!this.timePeriodCombination.length) {
            this.timePeriodCombination[0] = {
                days,
                quantity: 1,
            };
        } else {
            let found = false;
            this.timePeriodCombination.forEach(obj => {
                if (obj.days === days) {
                    obj.quantity++;
                    found = true;
                }
            });
            if (!found) {
                this.timePeriodCombination.push({
                    days,
                    quantity: 1,
                });
            }
        }
    }

    clear() {
        this.timePeriodCombination.length = 0;
    }

    getCombination() {
        return this.timePeriodCombination;
    }
}

export interface DayQuantityCombination {
    days: number;
    quantity: number;
}

/**
 * Calculates list of periods that sums up to totalDays
 * @param timePeriods
 * @param totalDays
 * @return {DayQuantityCombination[]} list of objects whose key: days sums up to totalDays (like: [{days: 7, quantity: 1}, {days: 1, quantity: 2}] = 9 totalDays)
 * @private
 */
function minDaysCombination(timePeriods: number[], totalDays: number): DayQuantityCombination[] {
    // create an array to hold the minimum number of timePeriods to make each totalDays
    // totalDays + 1 so that you will have indices from 0 to totalDays in the array
    const minTimePeriods = new Array(totalDays + 1).fill(Infinity);
    const timePeriodCombination = new Array(totalDays + 1);

    for (let i = 0; i < timePeriodCombination.length; i++) {
        timePeriodCombination[i] = new TimePeriods();
    }

    // there are 0 ways to make totalDays 0 with positive timePeriod values
    minTimePeriods[0] = 0;

    // look at one timePeriod at a time
    for (const timePeriod of timePeriods) {
        for (let i = 0; i <= totalDays; i += 1) {
            // make sure the difference between the current totalDays and the current timePeriod is at least 0
            // replace the minimum value
            if (i - timePeriod >= 0) {
                const temp = minTimePeriods[i];
                minTimePeriods[i] = Math.min(minTimePeriods[i], minTimePeriods[i - timePeriod] + 1);
                if (temp !== minTimePeriods[i]) {
                    timePeriodCombination[i].clear();
                    timePeriodCombination[i].setCombination([
                        ...timePeriodCombination[i - timePeriod].getCombination(),
                    ]);
                    timePeriodCombination[i].addDays(timePeriod);
                }
            }
        }
    }

    // if the value remains Infinity, it means that no timePeriod combination can make that number of days
    return minTimePeriods[totalDays] !== Infinity ? timePeriodCombination[totalDays].getCombination() : [];
}

export default minDaysCombination;