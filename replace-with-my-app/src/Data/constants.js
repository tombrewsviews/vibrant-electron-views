export let INITIAL_DATA = 'INITIAL_DATA';
export let SET = 'SET';
export let REMOVE = 'REMOVE';
export let OK = 'OK';
export let ERROR = 'ERROR';
export let INVALID_FIELD_MESSAGE = 'Please answer this question';
export let DISABLED_FIELD_MESSAGE = '___Question_Disabled___';
export let QUESTION_SKIPPED = '___Question_Skipped___';
export let PHONE_TYPES = ['cell', 'landline'];

export let JOINING_AS = {
  PROVIDER: 'PROVIDER',
  SUBSCRIBER_GROUP: 'SUBSCRIBER_GROUP',
  BROKER: 'BROKER',
};

export let JOINING_AS_REPEATER = {
  PROVIDER: 'a dental provider',
  SUBSCRIBER_GROUP: 'an employer',
  BROKER: 'an agent',
};

export let ADD = {
  COMPANY: 'COMPANY',
  LOCATION: 'LOCATION',
  PROFESSIONAL: 'PROFESSIONAL',
  SUBSCRIBER: 'SUBSCRIBER',
  USER: 'USER',
  ACCEPT_AGREEMENT: 'ACCEPT_AGREEMENT',
};

export let EDIT = {
  COMPANY: 'COMPANY',
  LOCATION: 'LOCATION',
  PROFESSIONAL: 'EDIT.PROFESSIONAL',
  SUBSCRIBER: 'SUBSCRIBER',
  SUBSCRIBER_DEPENDENT: 'SUBSCRIBER_DEPENDENT',
};

export let DEFAULT_ADDRESS = {
  street: '',
  city: '',
  state: '',
  zip: '',
};
export let COMPANY_TYPES = [
  {
    text: 'Individual/Sole proprietor/Single-member LLC',
    id: 'Individual/Sole proprietor/Single-member LLC',
  },
  { text: 'C Corporation', id: 'C Corporation' },
  { text: 'S Corporation', id: 'S Corporation' },
  { text: 'Partnership', id: 'Partnership' },
  { text: 'Trust/Estate', id: 'Trust/Estate' },
  { text: 'LLC - C Corp', id: 'LLC - C Corp' },
  { text: 'LLC - S Corp', id: 'LLC - S Corp' },
  { text: 'LLC - Partnership', id: 'LLC - Partnership' },
];

export let MAX_PEOPLE = 5;

export let MARITAL_STATUS = [
  {
    id: 'Single',
    text: 'Single',
  },
  {
    id: 'Married',
    text: 'Married',
  },
  {
    id: 'Separated',
    text: 'Separated',
  },
  {
    id: 'Divorced',
    text: 'Divorced',
  },
  {
    id: 'Widowed',
    text: 'Widowed',
  },
];

export let PLANS = ['Basic', 'Enhanced'];

export let AUTH = {
  CHANGE_PASSWORD: 'auth/CHANGE_PASSWORD',
  SIGNIN: 'auth/SIGNIN',
  SIGNIN_NEW_PASSWORD_REQUIRED: 'auth/SIGNIN_NEW_PASSWORD_REQUIRED',
  SIGNUP: 'auth/SIGNUP',
  SIGNUP_CONFIRM: 'auth/SIGNUP_CONFIRM',
  RESET_PASSWORD: 'auth/RESET_PASSWORD',
  RESET_PASSWORD_CONFIRM: 'auth/RESET_PASSWORD_CONFIRM',
  SET_NEW_PASSWORD: 'auth/SET_NEW_PASSWORD',
};

export let GENDER = [
  {
    id: 'Male',
    text: 'Male',
  },
  {
    id: 'Female',
    text: 'Female',
  },
  {
    id: 'PreferNotToDefine',
    text: 'Prefer not to define',
  },
];

export let RELATIONSHIP = [
  { text: 'Spouse', id: 'Spouse' },
  { text: 'Child', id: 'Child' },
  { text: 'Other', id: 'Other' },
];
