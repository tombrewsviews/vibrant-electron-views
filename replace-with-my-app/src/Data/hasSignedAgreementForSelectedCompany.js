import { useAuth } from './Auth.js';
import { useSelected } from './Selected.js';
import { useMemo } from 'react';

export default function useHasSignedAgreementForSelectedCompany() {
  let auth = useAuth();
  let [selected] = useSelected();

  return useMemo(() => {
    let company = auth.data.companies.find(
      item => item.id === selected.companyId
    );
    return company && company.has_accepted_agreement;
  }, [auth, selected.companyId]);
}
