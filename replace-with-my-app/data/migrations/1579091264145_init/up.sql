CREATE TABLE public.addresses (
    id uuid DEFAULT public.gen_random_uuid() NOT NULL,
    street text NOT NULL,
    city text NOT NULL,
    state text NOT NULL,
    zip text NOT NULL,
    country text DEFAULT 'US'::text NOT NULL,
    latitude numeric,
    longitude numeric,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone
);
CREATE TABLE public.members (
    id uuid DEFAULT public.gen_random_uuid() NOT NULL,
    profile_id uuid NOT NULL,
    user_id uuid,
    company_id uuid,
    plan_id uuid,
    provider_location_id uuid,
    professional_id uuid,
    status text DEFAULT 'Created'::text NOT NULL,
    policy_id text,
    effective_date date NOT NULL,
    termination_date date,
    main_member_id uuid,
    relationship_to_main_member text,
    is_configuration_up_to_member boolean DEFAULT false NOT NULL,
    has_accepted_agreement boolean DEFAULT false NOT NULL,
    accepted_agreement_by_user_id uuid,
    accepted_agreement_on timestamp with time zone,
    created_by_user_id uuid,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone
);
CREATE TABLE public.professionals (
    id uuid DEFAULT public.gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    national_provider_id text,
    license_id uuid NOT NULL,
    license_number text,
    license_custom_age_min integer,
    license_custom_age_max integer,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone,
    is_accepting_new_patients boolean DEFAULT true NOT NULL
);
CREATE TABLE public.provider_locations (
    id uuid DEFAULT public.gen_random_uuid() NOT NULL,
    company_id uuid NOT NULL,
    address_id uuid NOT NULL,
    company_doing_business_as_id uuid,
    website text,
    phone_number text,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    deleted_at timestamp with time zone
);
CREATE TABLE public.companies (
    id uuid DEFAULT public.gen_random_uuid() NOT NULL,
    legal_name text NOT NULL,
    federal_tax_id_number text NOT NULL,
    primary_industry_sic_code text,
    physical_address_id uuid NOT NULL,
    phone_number text NOT NULL,
    business_type text NOT NULL,
    created_by_user_id uuid NOT NULL,
    broker_id uuid,
    effective_date date,
    expiry_date date,
    national_provider_id text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone,
    financial_email text NOT NULL,
    hr_email text NOT NULL
);
CREATE TABLE public.company_agreements (
    id uuid DEFAULT public.gen_random_uuid() NOT NULL,
    company_id uuid NOT NULL,
    type text NOT NULL,
    has_accepted_agreement boolean DEFAULT false NOT NULL,
    accepted_agreement_by_user_id uuid,
    accepted_agreement_document text,
    accepted_agreement_on timestamp with time zone,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone
);
CREATE TABLE public.company_doing_business_as (
    id uuid DEFAULT public.gen_random_uuid() NOT NULL,
    company_id uuid NOT NULL,
    name text NOT NULL
);
CREATE TABLE public.company_users (
    company_id uuid NOT NULL,
    user_id uuid NOT NULL,
    role text NOT NULL
);
CREATE TABLE public.member_group_contributions (
    id uuid DEFAULT public.gen_random_uuid() NOT NULL,
    plan_id uuid NOT NULL,
    company_id uuid NOT NULL,
    contribution jsonb DEFAULT jsonb_build_object() NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone
);
CREATE TABLE public.professional_locations (
    professional_id uuid NOT NULL,
    provider_location_id uuid NOT NULL
);
CREATE TABLE public.profiles (
    id uuid DEFAULT public.gen_random_uuid() NOT NULL,
    first_name text NOT NULL,
    last_name text NOT NULL,
    date_of_birth date,
    gender text,
    signature text,
    address_id uuid,
    marital_status text,
    title text,
    social_security_number text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone
);
CREATE TABLE public.users (
    id uuid DEFAULT public.gen_random_uuid() NOT NULL,
    email text NOT NULL,
    has_accepted_terms boolean DEFAULT false NOT NULL,
    phone_number text,
    cognito_id text,
    profile_id uuid,
    can_be_support boolean DEFAULT false NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone
);
CREATE TABLE public.feedback (
    id uuid DEFAULT public.gen_random_uuid() NOT NULL,
    message text NOT NULL,
    user_id uuid,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    app text NOT NULL,
    context jsonb
);
CREATE TABLE public.company_agreement_types (
    name text NOT NULL
);
CREATE TABLE public.genders (
    name text NOT NULL
);
CREATE TABLE public.licenses (
    name text NOT NULL,
    id uuid DEFAULT public.gen_random_uuid() NOT NULL,
    is_primary_care boolean DEFAULT false NOT NULL,
    default_age_min integer DEFAULT 0,
    default_age_max integer DEFAULT 150,
    can_age_be_set_by_professional boolean DEFAULT true NOT NULL
);
CREATE TABLE public.marital_statuses (
    name text NOT NULL
);
CREATE TABLE public.plans (
    id uuid DEFAULT public.gen_random_uuid() NOT NULL,
    name text NOT NULL,
    effective_date date DEFAULT now() NOT NULL,
    pricing jsonb DEFAULT jsonb_build_object() NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone
);
CREATE TABLE public.procedure_tags (
    procedure_id uuid NOT NULL,
    name text NOT NULL
);
CREATE TABLE public.procedures (
    id uuid DEFAULT public.gen_random_uuid() NOT NULL,
    name text NOT NULL,
    code text NOT NULL,
    plan_id uuid NOT NULL,
    prepaid numeric DEFAULT 0 NOT NULL,
    patient_fee_value numeric DEFAULT 0 NOT NULL,
    is_patient_fee_percentage boolean DEFAULT false NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone
);
CREATE TABLE public.relationships (
    name text NOT NULL
);
CREATE TABLE public.statuses (
    name text NOT NULL
);
CREATE TABLE public.tags (
    name text NOT NULL
);
ALTER TABLE ONLY public.addresses
    ADD CONSTRAINT addresses_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.companies
    ADD CONSTRAINT companies_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.company_agreements
    ADD CONSTRAINT company_agreements_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.company_doing_business_as
    ADD CONSTRAINT company_doing_business_as_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.company_agreement_types
    ADD CONSTRAINT company_types_enum_pkey PRIMARY KEY (name);
ALTER TABLE ONLY public.company_users
    ADD CONSTRAINT company_users_pkey PRIMARY KEY (company_id, user_id, role);
ALTER TABLE ONLY public.feedback
    ADD CONSTRAINT feedback_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.genders
    ADD CONSTRAINT genders_pkey PRIMARY KEY (name);
ALTER TABLE ONLY public.licenses
    ADD CONSTRAINT licenses_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.marital_statuses
    ADD CONSTRAINT marital_statuses_pkey PRIMARY KEY (name);
ALTER TABLE ONLY public.member_group_contributions
    ADD CONSTRAINT member_group_contributions_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.member_group_contributions
    ADD CONSTRAINT member_group_contributions_plan_id_company_id_key UNIQUE (plan_id, company_id);
ALTER TABLE ONLY public.members
    ADD CONSTRAINT members_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.members
    ADD CONSTRAINT members_policy_id_key UNIQUE (policy_id);
ALTER TABLE ONLY public.plans
    ADD CONSTRAINT plans_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.procedure_tags
    ADD CONSTRAINT procedure_tags_pkey PRIMARY KEY (procedure_id, name);
ALTER TABLE ONLY public.procedures
    ADD CONSTRAINT procedures_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.professional_locations
    ADD CONSTRAINT professional_locations_pkey PRIMARY KEY (professional_id, provider_location_id);
ALTER TABLE ONLY public.professionals
    ADD CONSTRAINT professionals_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.professionals
    ADD CONSTRAINT professionals_user_id_key UNIQUE (user_id);
ALTER TABLE ONLY public.profiles
    ADD CONSTRAINT profiles_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.provider_locations
    ADD CONSTRAINT provider_locations_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.relationships
    ADD CONSTRAINT relationships_pkey PRIMARY KEY (name);
ALTER TABLE ONLY public.statuses
    ADD CONSTRAINT statuses_pkey PRIMARY KEY (name);
ALTER TABLE ONLY public.tags
    ADD CONSTRAINT tags_pkey PRIMARY KEY (name);
ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_cognito_id_key UNIQUE (cognito_id);
ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);
ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_phone_number_key UNIQUE (phone_number);
ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_profile_id_key UNIQUE (profile_id);
ALTER TABLE ONLY public.companies
    ADD CONSTRAINT companies_broker_id_fkey FOREIGN KEY (broker_id) REFERENCES public.companies(id) ON UPDATE RESTRICT ON DELETE RESTRICT;
ALTER TABLE ONLY public.companies
    ADD CONSTRAINT companies_created_by_user_id_fkey FOREIGN KEY (created_by_user_id) REFERENCES public.users(id) ON UPDATE RESTRICT ON DELETE RESTRICT;
ALTER TABLE ONLY public.companies
    ADD CONSTRAINT companies_physical_address_id_fkey FOREIGN KEY (physical_address_id) REFERENCES public.addresses(id) ON UPDATE RESTRICT ON DELETE RESTRICT;
ALTER TABLE ONLY public.company_agreements
    ADD CONSTRAINT company_agreements_accepted_agreement_by_user_id_fkey FOREIGN KEY (accepted_agreement_by_user_id) REFERENCES public.users(id) ON UPDATE RESTRICT ON DELETE RESTRICT;
ALTER TABLE ONLY public.company_agreements
    ADD CONSTRAINT company_agreements_company_id_fkey FOREIGN KEY (company_id) REFERENCES public.companies(id) ON UPDATE RESTRICT ON DELETE RESTRICT;
ALTER TABLE ONLY public.company_agreements
    ADD CONSTRAINT company_agreements_type_fkey FOREIGN KEY (type) REFERENCES public.company_agreement_types(name) ON UPDATE RESTRICT ON DELETE RESTRICT;
ALTER TABLE ONLY public.company_doing_business_as
    ADD CONSTRAINT company_doing_business_as_company_id_fkey FOREIGN KEY (company_id) REFERENCES public.companies(id) ON UPDATE RESTRICT ON DELETE RESTRICT;
ALTER TABLE ONLY public.company_users
    ADD CONSTRAINT company_users_company_id_fkey FOREIGN KEY (company_id) REFERENCES public.companies(id) ON UPDATE RESTRICT ON DELETE RESTRICT;
ALTER TABLE ONLY public.company_users
    ADD CONSTRAINT company_users_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON UPDATE RESTRICT ON DELETE RESTRICT;
ALTER TABLE ONLY public.feedback
    ADD CONSTRAINT feedback_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON UPDATE RESTRICT ON DELETE RESTRICT;
ALTER TABLE ONLY public.member_group_contributions
    ADD CONSTRAINT member_group_contributions_company_id_fkey FOREIGN KEY (company_id) REFERENCES public.companies(id);
ALTER TABLE ONLY public.member_group_contributions
    ADD CONSTRAINT member_group_contributions_plan_id_fkey FOREIGN KEY (plan_id) REFERENCES public.plans(id);
ALTER TABLE ONLY public.members
    ADD CONSTRAINT members_accepted_agreement_by_user_id_fkey FOREIGN KEY (accepted_agreement_by_user_id) REFERENCES public.users(id);
ALTER TABLE ONLY public.members
    ADD CONSTRAINT members_company_id_fkey FOREIGN KEY (company_id) REFERENCES public.companies(id);
ALTER TABLE ONLY public.members
    ADD CONSTRAINT members_created_by_user_id_fkey FOREIGN KEY (created_by_user_id) REFERENCES public.users(id);
ALTER TABLE ONLY public.members
    ADD CONSTRAINT members_main_member_id_fkey FOREIGN KEY (main_member_id) REFERENCES public.members(id);
ALTER TABLE ONLY public.members
    ADD CONSTRAINT members_plan_id_fkey FOREIGN KEY (plan_id) REFERENCES public.plans(id);
ALTER TABLE ONLY public.members
    ADD CONSTRAINT members_professional_id_fkey FOREIGN KEY (professional_id) REFERENCES public.professionals(id);
ALTER TABLE ONLY public.members
    ADD CONSTRAINT members_profile_id_fkey FOREIGN KEY (profile_id) REFERENCES public.profiles(id);
ALTER TABLE ONLY public.members
    ADD CONSTRAINT members_provider_location_id_fkey FOREIGN KEY (provider_location_id) REFERENCES public.provider_locations(id);
ALTER TABLE ONLY public.members
    ADD CONSTRAINT members_relationship_to_main_member_fkey FOREIGN KEY (relationship_to_main_member) REFERENCES public.relationships(name);
ALTER TABLE ONLY public.members
    ADD CONSTRAINT members_status_fkey FOREIGN KEY (status) REFERENCES public.statuses(name);
ALTER TABLE ONLY public.members
    ADD CONSTRAINT members_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);
ALTER TABLE ONLY public.procedure_tags
    ADD CONSTRAINT procedure_tags_procedure_id_fkey FOREIGN KEY (procedure_id) REFERENCES public.procedures(id) ON UPDATE RESTRICT ON DELETE RESTRICT;
ALTER TABLE ONLY public.procedure_tags
    ADD CONSTRAINT procedure_tags_tag_fkey FOREIGN KEY (name) REFERENCES public.tags(name) ON UPDATE RESTRICT ON DELETE RESTRICT;
ALTER TABLE ONLY public.procedures
    ADD CONSTRAINT procedures_plan_id_fkey FOREIGN KEY (plan_id) REFERENCES public.plans(id) ON UPDATE RESTRICT ON DELETE RESTRICT;
ALTER TABLE ONLY public.professional_locations
    ADD CONSTRAINT professional_locations_professional_id_fkey FOREIGN KEY (professional_id) REFERENCES public.professionals(id) ON UPDATE RESTRICT ON DELETE RESTRICT;
ALTER TABLE ONLY public.professional_locations
    ADD CONSTRAINT professional_locations_provider_location_id_fkey FOREIGN KEY (provider_location_id) REFERENCES public.provider_locations(id) ON UPDATE RESTRICT ON DELETE RESTRICT;
ALTER TABLE ONLY public.professionals
    ADD CONSTRAINT professionals_license_id_fkey FOREIGN KEY (license_id) REFERENCES public.licenses(id) ON UPDATE RESTRICT ON DELETE RESTRICT;
ALTER TABLE ONLY public.professionals
    ADD CONSTRAINT professionals_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON UPDATE RESTRICT ON DELETE RESTRICT;
ALTER TABLE ONLY public.profiles
    ADD CONSTRAINT profiles_address_id_fkey FOREIGN KEY (address_id) REFERENCES public.addresses(id) ON UPDATE RESTRICT ON DELETE RESTRICT;
ALTER TABLE ONLY public.profiles
    ADD CONSTRAINT profiles_gender_fkey FOREIGN KEY (gender) REFERENCES public.genders(name) ON UPDATE RESTRICT ON DELETE RESTRICT;
ALTER TABLE ONLY public.profiles
    ADD CONSTRAINT profiles_marital_status_fkey FOREIGN KEY (marital_status) REFERENCES public.marital_statuses(name) ON UPDATE RESTRICT ON DELETE RESTRICT;
ALTER TABLE ONLY public.provider_locations
    ADD CONSTRAINT provider_locations_address_id_fkey FOREIGN KEY (address_id) REFERENCES public.addresses(id) ON UPDATE RESTRICT ON DELETE RESTRICT;
ALTER TABLE ONLY public.provider_locations
    ADD CONSTRAINT provider_locations_company_doing_business_as_id_fkey FOREIGN KEY (company_doing_business_as_id) REFERENCES public.company_doing_business_as(id) ON UPDATE RESTRICT ON DELETE RESTRICT;
ALTER TABLE ONLY public.provider_locations
    ADD CONSTRAINT provider_locations_company_id_fkey FOREIGN KEY (company_id) REFERENCES public.companies(id) ON UPDATE RESTRICT ON DELETE RESTRICT;
ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_profile_id_fkey FOREIGN KEY (profile_id) REFERENCES public.profiles(id) ON UPDATE RESTRICT ON DELETE RESTRICT;


CREATE FUNCTION public.members_addresses(member public.members) RETURNS SETOF public.addresses
    LANGUAGE sql STABLE
    AS $$
  SELECT * FROM addresses
  WHERE (
    addresses.id = ANY (
      SELECT address_id FROM profiles
      WHERE profiles.id = ANY (
        SELECT profile_id FROM members
            WHERE
                members.id = member.id
            OR
                members.id = member.main_member_id
        )
    )
  );
$$;
CREATE FUNCTION public.members_email(member public.members) RETURNS text
    LANGUAGE sql STABLE
    AS $$
  SELECT email FROM users
  WHERE users.id = member.user_id
    OR users.id = (
      SELECT user_id FROM members
        WHERE id = member.main_member_id
    );
$$;
CREATE FUNCTION public.members_employer_name(member public.members) RETURNS text
    LANGUAGE sql STABLE
    AS $$
  SELECT legal_name FROM companies
  WHERE companies.id = member.company_id
    OR companies.id = (
      SELECT company_id FROM members
        WHERE id = member.main_member_id
    );
$$;
CREATE FUNCTION public.members_expiry_date(member public.members) RETURNS date
    LANGUAGE sql STABLE
    AS $$
  SELECT expiry_date FROM companies
  WHERE companies.id = member.company_id
    OR companies.id = (
      SELECT company_id FROM members
        WHERE id = member.main_member_id
    );
$$;
CREATE FUNCTION public.members_phone_number(member public.members) RETURNS text
    LANGUAGE sql STABLE
    AS $$
  SELECT phone_number FROM users
  WHERE users.id = member.user_id
    OR users.id = (
      SELECT user_id FROM members
        WHERE id = member.main_member_id
    );
$$;


CREATE FUNCTION public.professionals_full_name(professional public.professionals) RETURNS text
    LANGUAGE sql STABLE
    AS $$
  SELECT
    profile.first_name || ' ' ||
    profile.last_name AS full_name
  FROM users
  INNER JOIN profiles AS profile
    ON profile.id = users.profile_id
  WHERE users.id = professional.user_id;
$$;
CREATE FUNCTION public.professionals_full_name_and_license(professional public.professionals) RETURNS text
    LANGUAGE sql STABLE
    AS $$
  SELECT
    profile.first_name || ' ' ||
    profile.last_name || ' • ' ||
    license.name AS full_name_and_license
  FROM professionals
  INNER JOIN users AS usr
    ON usr.id = professionals.user_id
  INNER JOIN profiles AS profile
    ON profile.id = usr.profile_id
  INNER JOIN licenses AS license
    ON license.id = professionals.license_id
  WHERE professionals.id = professional.id;
$$;


CREATE FUNCTION public.provider_locations_doing_business_as_and_address(provider_location public.provider_locations) RETURNS text
    LANGUAGE sql STABLE
    AS $$
  SELECT
    dba.name || ' • ' ||
    address.street || ', ' ||
    address.city || ', ' ||
    address.state || ', ' ||
    address.zip AS doing_business_as_and_address
  FROM provider_locations
  INNER JOIN company_doing_business_as AS dba
    ON dba.id = provider_locations.company_doing_business_as_id
  INNER JOIN addresses AS address
    ON address.id = provider_locations.address_id
  WHERE provider_locations.id = provider_location.id;
$$;
CREATE FUNCTION public.set_companies_default_expiry_date() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
DECLARE
    _new record;
BEGIN
    _new := NEW;
    _new. "expiry_date" = _new. "effective_date" + interval '1 year' - interval '1 day';
    RETURN _new;
END;
$$;
CREATE FUNCTION public.set_current_timestamp_updated_at() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
DECLARE
  _new record;
BEGIN
  _new := NEW;
  _new."updated_at" = NOW();
  RETURN _new;
END;
$$;


CREATE TRIGGER set_public_addresses_updated_at BEFORE UPDATE ON public.addresses FOR EACH ROW EXECUTE FUNCTION public.set_current_timestamp_updated_at();
COMMENT ON TRIGGER set_public_addresses_updated_at ON public.addresses IS 'trigger to set value of column "updated_at" to current timestamp on row update';
CREATE TRIGGER set_public_companies_expiry_date BEFORE INSERT ON public.companies FOR EACH ROW EXECUTE FUNCTION public.set_companies_default_expiry_date();
CREATE TRIGGER set_public_companies_update_expiry_date BEFORE UPDATE ON public.companies FOR EACH ROW EXECUTE FUNCTION public.set_companies_default_expiry_date();
CREATE TRIGGER set_public_companies_updated_at BEFORE UPDATE ON public.companies FOR EACH ROW EXECUTE FUNCTION public.set_current_timestamp_updated_at();
COMMENT ON TRIGGER set_public_companies_updated_at ON public.companies IS 'trigger to set value of column "updated_at" to current timestamp on row update';
CREATE TRIGGER set_public_company_agreements_updated_at BEFORE UPDATE ON public.company_agreements FOR EACH ROW EXECUTE FUNCTION public.set_current_timestamp_updated_at();
COMMENT ON TRIGGER set_public_company_agreements_updated_at ON public.company_agreements IS 'trigger to set value of column "updated_at" to current timestamp on row update';
CREATE TRIGGER set_public_member_group_contributions_updated_at BEFORE UPDATE ON public.member_group_contributions FOR EACH ROW EXECUTE FUNCTION public.set_current_timestamp_updated_at();
COMMENT ON TRIGGER set_public_member_group_contributions_updated_at ON public.member_group_contributions IS 'trigger to set value of column "updated_at" to current timestamp on row update';
CREATE TRIGGER set_public_members_updated_at BEFORE UPDATE ON public.members FOR EACH ROW EXECUTE FUNCTION public.set_current_timestamp_updated_at();
COMMENT ON TRIGGER set_public_members_updated_at ON public.members IS 'trigger to set value of column "updated_at" to current timestamp on row update';
CREATE TRIGGER set_public_plans_updated_at BEFORE UPDATE ON public.plans FOR EACH ROW EXECUTE FUNCTION public.set_current_timestamp_updated_at();
COMMENT ON TRIGGER set_public_plans_updated_at ON public.plans IS 'trigger to set value of column "updated_at" to current timestamp on row update';
CREATE TRIGGER set_public_procedures_updated_at BEFORE UPDATE ON public.procedures FOR EACH ROW EXECUTE FUNCTION public.set_current_timestamp_updated_at();
COMMENT ON TRIGGER set_public_procedures_updated_at ON public.procedures IS 'trigger to set value of column "updated_at" to current timestamp on row update';
CREATE TRIGGER set_public_professionals_updated_at BEFORE UPDATE ON public.professionals FOR EACH ROW EXECUTE FUNCTION public.set_current_timestamp_updated_at();
COMMENT ON TRIGGER set_public_professionals_updated_at ON public.professionals IS 'trigger to set value of column "updated_at" to current timestamp on row update';
CREATE TRIGGER set_public_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.set_current_timestamp_updated_at();
COMMENT ON TRIGGER set_public_profiles_updated_at ON public.profiles IS 'trigger to set value of column "updated_at" to current timestamp on row update';
CREATE TRIGGER set_public_provider_locations_updated_at BEFORE UPDATE ON public.provider_locations FOR EACH ROW EXECUTE FUNCTION public.set_current_timestamp_updated_at();
COMMENT ON TRIGGER set_public_provider_locations_updated_at ON public.provider_locations IS 'trigger to set value of column updated_at to current timestamp on row update';
CREATE TRIGGER set_public_users_updated_at BEFORE UPDATE ON public.users FOR EACH ROW EXECUTE FUNCTION public.set_current_timestamp_updated_at();
COMMENT ON TRIGGER set_public_users_updated_at ON public.users IS 'trigger to set value of column "updated_at" to current timestamp on row update';
