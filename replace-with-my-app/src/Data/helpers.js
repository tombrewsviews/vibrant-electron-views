import { DATA_KEYS, DATA } from './definitions.js';
import toPascalCase from 'to-pascal-case';
import {
  INVALID_FIELD_MESSAGE,
  DISABLED_FIELD_MESSAGE,
  INITIAL_DATA,
  SET,
  MAX_PEOPLE,
  MARITAL_STATUS,
  // GROUP,
} from './constants.js';

// The next step is a step that isn't valid yet
// if everything is valid, it means there's no next step.
// We return null to indicate that.
//
// Notice that we look at the Valid key and not the ValidTemp.
// We only care about final values.
//
// Since the states here are the QUESTION
export let getNextInvalidField = (valid, applicable, skip = null) => {
  // questions are filtered in the data.js file so that any question that is no longer applicable
  // will be taken out of the list of applicable questions & not shown to the user
  let next = applicable.find(key => key !== skip && !valid[`${key}Valid`]);
  return next ? toPascalCase(next) : null;
};

export let getApplicableData = (data, exclude) => {
  return DATA_KEYS.filter(key => {
    if (exclude.includes(key)) return false;

    let field = DATA[key];
    if (field.isSecondary) return false;

    return typeof field.onWhen === 'function' ? field.onWhen(data) : true;
  });
};

export let getRepeaters = (data, nextInvalidField, exclude) => {
  let repeaters = {};

  DATA_KEYS.filter(key => !exclude.includes(key)).forEach(key => {
    let keyRepeater = `${key}Repeater`;
    let field = DATA[key];

    if (toPascalCase(key) === nextInvalidField) {
      repeaters[keyRepeater] = INVALID_FIELD_MESSAGE;
    } else if (typeof field.format === 'function') {
      repeaters[keyRepeater] = field.format(data);
    } else {
      repeaters[keyRepeater] = data[key];
    }

    let shouldIncludeRepeaterAsDisabled = !repeaters[keyRepeater];
    if (shouldIncludeRepeaterAsDisabled && field.onWhen) {
      shouldIncludeRepeaterAsDisabled = field.onWhen(data);
    }

    if (shouldIncludeRepeaterAsDisabled) {
      repeaters[keyRepeater] = DISABLED_FIELD_MESSAGE;
    }
  });

  return repeaters;
};

let MINIMUM_PROGRESS = 10;
export let getProgressPercentage = (valid, applicableData) => {
  let answeredFields = applicableData.filter(field => valid[`${field}Valid`]);

  let answeredProgress = (answeredFields.length / applicableData.length) * 100;

  let progress = Math.min(
    Math.round(
      MINIMUM_PROGRESS + ((100 - MINIMUM_PROGRESS) * answeredProgress) / 100
    ),
    100
  );

  return `${progress}%`;
};

export let set = (key, value) => ({
  type: SET,
  key,
  value,
});

export let setInitialData = data => ({
  type: INITIAL_DATA,
  data,
});

export let setAddressReducer = (state, action) => {
  switch (action.type) {
    case 'SET':
      return {
        ...state,
        [`address${action.key}`]: action.value,
      };
    case 'SET_ALL':
      return { ...action.value };
    default:
      throw new Error(`Action not implemented ${JSON.stringify(action)}`);
  }
};

export let setInitialAddress = (data = {}) => {
  return ['Street', 'City', 'State', 'Zip'].reduce((addr, value) => {
    addr[`address${value}`] = data[`address${value}`];
    return addr;
  }, {});
};

export let setGroupValues = (state, action) => ({
  ...state,
  ...action.value,
  [action.key]: Object.values(action.value).join(' '),
});

export let buildInitialAddress = address => {
  return ['Street', 'City', 'State', 'Zip'].reduce((addr, value) => {
    addr[`address${value}`] = address[`address${value}`];
    return addr;
  }, {});
};

export let getPlanCost = (pricing, amountOfPeople) => {
  if (!pricing) return 0;

  switch (amountOfPeople) {
    case 1:
      return pricing.one_person;

    case 2:
      return pricing.two_people;

    case 3:
      return pricing.three_people;

    case 4:
      return pricing.four_people;

    default:
      return pricing.five_people_or_more;
  }
};

export let getContributionsForPlan = (data, planId) => {
  if (!data.subscriber_group_plan_contributions) return 0;

  return (
    data.subscriber_group_plan_contributions.find(
      item => item.plan.id === planId
    ) || 0
  );
};

export let getCostTotalAndCostToEmployer = data => {
  return data.subscribers.reduce(
    ([costTotal, costToTheEmployer], subscriber) => {
      let amountOfPeople = Math.min(
        1 + subscriber.subscriber_dependents_aggregate.aggregate.count,
        MAX_PEOPLE
      );

      let price = getPlanCost(subscriber.plan.pricing, amountOfPeople);
      let contribution = getPlanCost(
        getContributionsForPlan(data, subscriber.plan.id).contribution,
        amountOfPeople
      );
      return [costTotal + price, costToTheEmployer + contribution];
    },
    [0, 0]
  );
};

export let getMaritalStatus = () => {
  return MARITAL_STATUS.slice(0, -1);
};
