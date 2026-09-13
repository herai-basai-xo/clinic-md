import { useOrg } from '../contexts/OrgContext';

/**
 * Hook for accessing dental terminology and feature flags.
 * This app is dental-only — no multi-industry abstraction.
 */
export const useIndustry = () => {
  const {
    staffLabel,
    staffLabelPlural,
    locationLabel,
    locationLabelPlural,
    sessionLabel,
    sessionLabelPlural,
    enableChairs,
    enableStaffGender,
    enableSpecialties,
    enableCustomerGender,
    defaultCategories,
  } = useOrg();

  return {
    // Terminology
    staffLabel,
    staffLabelPlural,
    locationLabel,
    locationLabelPlural,
    sessionLabel,
    sessionLabelPlural,

    // Feature flags
    enableChairs,
    enableStaffGender,
    enableSpecialties,
    enableCustomerGender,

    // Default categories
    defaultCategories,
  };
};

export default useIndustry;
