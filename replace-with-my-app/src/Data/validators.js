import phoneRegex from 'phone-regex';
import {
  JOINING_AS,
  PHONE_TYPES,
  GENDER,
  RELATIONSHIP,
  MARITAL_STATUS,
} from './constants.js';
import { validate as isValidEmail } from 'email-validator';
import endOfToday from 'date-fns/endOfToday';
import isAfterDate from 'date-fns/isAfter';
import isPastDate from 'date-fns/isPast';
import isValidDate from 'date-fns/isValid';
import parseISODate from 'date-fns/parseISO';
import sicCodes from '../Captures/sicCodes.json';
import subYears from 'date-fns/subYears';

export function email(value) {
  return isValidEmail(value);
}
// https://stackoverflow.com/a/2385967/1562732
export function name(value) {
  return (
    value &&
    /^[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð][a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ,.'-]+$/u.test(
      value.trim()
    )
  );
}
export function trueFalse(value) {
  return [true, false].includes(value);
}

let oldestBirthdayPossible = subYears(endOfToday(), 150);

// the date should be in the past
export function birthday(rvalue) {
  let value = parseISODate(rvalue);
  return (
    date(rvalue) &&
    isPastDate(value) &&
    isAfterDate(value, oldestBirthdayPossible)
  );
}

export function date(value) {
  return isValidDate(parseISODate(value));
}

export function phoneNumber(value) {
  return phoneRegex({ exact: true }).test(value);
}

export function textInput(value) {
  return value && value.length >= 2;
}

export function zip(value) {
  return `${value}`.length === 5;
}

export function address(value) {
  return (
    value &&
    textInput(value.street) &&
    textInput(value.city) &&
    textInput(value.state) &&
    zip(value.zip)
  );
}

export function image(value) {
  return value ? value.includes('data:image/png;base64') : false;
}

export function imageUpload(value) {
  return value ? value.includes('data:image/') : false;
}

export function signature(value) {
  let { data, type } = value;
  switch (type) {
    case 'sign':
    case 'write':
      return image(data);
    case 'upload':
      return imageUpload(data);
    default:
      throw new Error(`wrong signature type provided ${type}`);
  }
}

export function fein(value) {
  let noDash = value.replace('-', '');
  return value.length === 10 && Number(noDash) && noDash.length === 9;
}

export function sic(value) {
  return sicCodes.some(item => item.id === value);
}

export function doingBusinessAs(dba) {
  return textInput(dba);
}

export function yesNo(value) {
  return ['yes', 'no'].includes(value);
}

export function joiningAs(value) {
  return value in JOINING_AS;
}

export function isHomeOffice(value) {
  return trueFalse(value);
}

export function phoneType(value) {
  return PHONE_TYPES.includes(value);
}

let companyValidators = {
  name,
  fein,
  email,
  phoneNumber,
  doingBusinessAs,
  address,
  isHomeOffice,
};

export function companyDetails(value) {
  return Object.keys(value).every(key => companyValidators[key](value[key]));
}

export function company(value) {
  return value.trim().length > 0;
}
export function locations(value) {
  return value.length > 0;
}
export function professionals(value) {
  return value.length > 0;
}

export function npi(value) {
  return /^\d{10}$/.test(value);
}

export function signupCode(value) {
  return /^\d{6}$/.test(value);
}

export function website(value) {
  if (!value) return true;
  return value.includes('.');
}

let LOWERCASE_LETTERS = /[a-z]/;
let UPPERCASE_LETTERS = /[A-Z]/;
let NUMBERS = /[0-9]/;
let SPECIAL_CHARACTERS = /[\^$*.[\]{}()?\-"!@#%&/,><':;|_~`]/;
export function password(value) {
  return (
    value.length >= 8 &&
    LOWERCASE_LETTERS.test(value) &&
    UPPERCASE_LETTERS.test(value) &&
    NUMBERS.test(value) &&
    SPECIAL_CHARACTERS.test(value)
  );
}

export function user(values) {
  return values.useExistingUser
    ? values.user.id
    : isValidEmail(values.user.email) &&
        phoneNumber(values.user.phone_number) &&
        values.user.profile.first_name &&
        values.user.profile.last_name;
}

export function licenseNumber(value) {
  return value && /^\d{4}$/.test(value);
}

export function effectiveDate(value) {
  return new Date(value) >= new Date();
}

export function coveredMember(value) {
  return (
    textInput(value.profile.first_name) &&
    textInput(value.profile.last_name) &&
    birthday(value.profile.date_of_birth) &&
    gender(value.profile.gender) &&
    relationship(value.relationship)
  );
}

export function gender(value) {
  return GENDER.some(item => item.id === value);
}

export function relationship(value) {
  return RELATIONSHIP.some(item => item.id === value);
}

export function maritalStatus(value) {
  return MARITAL_STATUS.some(item => item.id === value);
}
