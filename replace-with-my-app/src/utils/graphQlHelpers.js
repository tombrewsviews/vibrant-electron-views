import * as isValid from 'Data/validators.js';
import { ADD, AUTH, EDIT } from 'Data/constants.js';
import { notifyInvalid } from './useNotifications.js';

function getInvalidFields(formName, values, comparator) {
  switch (formName) {
    case ADD.COMPANY: {
      return [
        !values.company.legal_name && 'legal name',
        !values.company.business_type && 'business type',
        !isValid.email(values.company.billing_email) && 'email',
        !isValid.phoneNumber(values.company.phone_number) && 'phone number',
        !values.company.physical_address.street && 'street',
        !values.company.physical_address.city && 'city',
        !values.company.physical_address.state && 'state',
        !values.company.physical_address.zip && 'zip',
        !values.company.federal_tax_id_number && 'Federal Tax ID (FEIN)',
        !isValid.sic(values.company.primary_industry_sic_code) &&
          'primary industry sic code',
        // TODO bring in NPI validation but not as required
        // values.company.isProvider &&
        //   !values.company.national_provider_id &&
        //   'National Provider ID',
        values.company.isProvider &&
          values.company.company_doing_business_as.length === 0 &&
          'dba',
        values.company.isSubscriberGroup &&
          !isValid.date(values.company.effective_date) &&
          'effective date',
      ];
    }

    case EDIT.COMPANY: {
      return [
        !values.company.legal_name && 'legal name',
        !isValid.email(values.company.billing_email) && 'email',
        !isValid.phoneNumber(values.company.phone_number) && 'phone number',
        !values.company.physical_address.street && 'street',
        !values.company.physical_address.city && 'city',
        !values.company.physical_address.state && 'state',
        !values.company.physical_address.zip && 'zip',
        !values.company.federal_tax_id_number && 'Federal Tax ID (FEIN)',
        !isValid.sic(values.company.primary_industry_sic_code) &&
          'primary industry sic code',
        // TODO bring in NPI validation but not as required
        // values.company.type === 'Provider' &&
        //   !values.national_provider_id &&
        //   'National Provider ID',
        values.company.type === 'Provider' &&
          values.company.company_doing_business_as.length === 0 &&
          'dba',
        // values.company.isSubscriberGroup &&
        //   !isValid.date(values.company.effective_date) &&
        //   'effective date',
      ];
    }

    case ADD.ACCEPT_AGREEMENT: {
      return [
        !values.company.has_accepted_agreement && 'accept agreement',
        !isValid.name(values.user.profile.title) &&
          'please provide you job title',
        (!values.user.profile.signature ||
          !values.user.profile.signature.blob) &&
          'please provide your signature',
      ];
    }

    case ADD.SUBSCRIBER: {
      return values.useExistingUser
        ? [
            !values.user_id && 'existing user',
            !values.user.upToSubscriber && !values.plan.id && 'plan type',
            (!values.effective_date ||
              new Date(values.effective_date) <=
                new Date(comparator.effective_date).setHours(0, 0, 0)) &&
              'effective date',
          ]
        : [
            !isValid.name(values.user.profile.first_name) && 'first name',
            !isValid.name(values.user.profile.last_name) && 'last name',
            !isValid.email(values.user.email) && 'email',
            !isValid.phoneNumber(values.user.phone_number) && 'phone number',
            !values.user.upToSubscriber && !values.plan.id && 'plan type',
            (!values.effective_date ||
              new Date(values.effective_date) <=
                new Date(comparator.effective_date).setHours(0, 0, 0)) &&
              'effective date',
          ];
    }

    case EDIT.SUBSCRIBER: {
      let { subscriber } = values;
      return [
        !isValid.name(subscriber.user.profile.first_name) && 'first name',
        !isValid.name(subscriber.user.profile.last_name) && 'last name',
        !isValid.email(subscriber.user.email) && 'email',
        !isValid.phoneNumber(subscriber.user.phone_number) && 'phone_number',
      ];
    }

    case EDIT.SUBSCRIBER_DEPENDENT: {
      let { subscriber_dependent } = values;
      return [
        !isValid.name(subscriber_dependent.profile.first_name) && 'first name',
        !isValid.name(subscriber_dependent.profile.last_name) && 'last name',
        !isValid.gender(subscriber_dependent.profile.gender) && 'gender',
        !isValid.relationship(subscriber_dependent.relationship) &&
          'relationship',
        !isValid.birthday(subscriber_dependent.profile.date_of_birth) &&
          'date of birth',
      ];
    }

    case ADD.PROFESSIONAL: {
      return values.useExistingUser
        ? [
            !values.user_id && 'existing user',
            !values.license.id && 'license',
            !isValid.licenseNumber(values.license_number) && 'license number',
            !values.locations.length > 0 && 'locations',
          ]
        : [
            !isValid.email(values.user.email) && 'email',
            !isValid.phoneNumber(values.user.phone_number) && 'phone number',
            !isValid.name(values.user.profile.first_name) && 'first name',
            !isValid.name(values.user.profile.last_name) && 'last name',
            !values.license.id && 'license',
            !isValid.licenseNumber(values.license_number) && 'license number',
            !values.locations.length > 0 && 'locations',
          ];
    }
    case EDIT.PROFESSIONAL: {
      return [
        !isValid.email(values.user.email) && 'email',
        !isValid.phoneNumber(values.user.phone_number) && 'phone number',
        !values.professional_locations.length > 0 && 'locations',
        !values.license.id && 'license',
        !isValid.licenseNumber(values.license_number) && 'license number',
      ];
    }

    case ADD.LOCATION: {
      return [
        !values.company_doing_business_as_id && 'name',
        !isValid.website(values.website) && 'website',
        !values.address.street && 'address',
        !values.address.city && 'city',
        !values.address.state && 'state',
        !values.address.zip && 'zip',
      ];
    }
    case EDIT.LOCATION: {
      return [
        !values.company_doing_business_as_id && 'name',
        !isValid.website(values.website) && 'website',
        !values.address.street && 'street',
        !values.address.city && 'city',
        !values.address.state && 'state',
        !values.address.zip && 'zip',
      ];
    }

    case ADD.USER: {
      return values.useExistingUser
        ? [!values.user_id && 'existing user']
        : [
            !isValid.name(values.user.profile.first_name) && 'first name',
            !isValid.name(values.user.profile.last_name) && 'last name',
            !isValid.email(values.user.email) && 'email',
            !isValid.phoneNumber(values.user.phone_number) && 'phone number',
            !values.role && 'role',
          ];
    }

    case EDIT.USER: {
      return [
        !isValid.name(values.user.profile.first_name) && 'first name',
        !isValid.name(values.user.profile.last_name) && 'last name',
        !isValid.email(values.user.email) && 'email',
        !isValid.phoneNumber(values.user.phone_number) && 'phone number',
        !values.user.company_users[0].role && 'role',
      ];
    }

    case AUTH.CHANGE_PASSWORD: {
      return [
        !isValid.password(values.old_password) && 'current password',
        !isValid.password(values.new_password) && 'new password',
        values.new_password === values.old_password &&
          'passwords should be different',
      ];
    }

    case AUTH.SIGNIN: {
      if (process.env.NODE_ENV === 'development') {
        return [!isValid.email(values.email) && 'email'];
      }

      return [
        !isValid.email(values.email) && 'email',
        !isValid.password(values.password) && 'password',
      ];
    }
    case AUTH.SIGNIN_NEW_PASSWORD_REQUIRED: {
      return [!isValid.password(values.password) && 'password'];
    }
    case AUTH.SIGNUP: {
      return [
        !isValid.email(values.email) && 'email',
        !values.first_name && 'first name',
        !values.last_name && 'last name',
        !isValid.password(values.password) && 'password',
      ];
    }
    case AUTH.SIGNUP_CONFIRM: {
      return [!isValid.signupCode(values.code) && 'code'];
    }
    case AUTH.RESET_PASSWORD: {
      return [!isValid.email(values.email) && 'email'];
    }
    case AUTH.RESET_PASSWORD_CONFIRM: {
      return [
        !isValid.signupCode(values.code) && 'code',
        !isValid.password(values.password) && 'password',
      ];
    }

    default: {
      if (process.env.NODE_ENV === 'development') {
        throw new Error(
          `getInvalidFields unreckognised formName "${formName}"`
        );
      }
      return [];
    }
  }
}

export function isInvalid(formName, values, notify, comparator) {
  try {
    let list = getInvalidFields(formName, values, comparator).filter(Boolean);
    if (list.length > 0) {
      if (typeof notify === 'function') {
        notify(notifyInvalid(list));
      }
      return true;
    }
    return false;
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('isInvalid', error);
    }
    return true;
  }
}
