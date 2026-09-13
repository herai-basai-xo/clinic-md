import React, { createContext, useContext, useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { fetchOrganizationBySlug } from '../services/api';

const TenantContext = createContext(null);

export const useTenant = () => {
  const context = useContext(TenantContext);
  if (!context) {
    throw new Error('useTenant must be used within a TenantProvider');
  }
  return context;
};

export const TenantProvider = ({ children }) => {
  const { orgSlug } = useParams();
  const [org, setOrg] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadTenant() {
      if (!orgSlug) {
        setError('No organization specified');
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await fetchOrganizationBySlug(orgSlug);

      if (fetchError || !data) {
        setError('Organization not found');
        setLoading(false);
        return;
      }

      setOrg(data);
      setLoading(false);
    }

    loadTenant();
  }, [orgSlug]);

  const getBookingJourneyText = () => 'Complete your dental booking journey';

  const value = {
    // Organization data
    org,
    orgId: org?.id,
    orgName: org?.name,
    orgSlug: org?.slug,
    orgPhone: org?.owner_email, // Could add phone to org later

    // Dental terminology (fixed — this app is dental-only)
    staffLabel: 'Dentist',
    staffLabelPlural: 'Dentists',
    locationLabel: 'Chair',
    locationLabelPlural: 'Chairs',
    enableChairs: true,
    enableStaffGender: true,

    // Helper text
    getBookingJourneyText,

    // Loading state
    loading,
    error,
  };

  return (
    <TenantContext.Provider value={value}>
      {children}
    </TenantContext.Provider>
  );
};

export default TenantContext;
