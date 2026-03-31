import React from 'react';

/**
 * Increments every time the user pulls to refresh on the Dashboard.
 * Child components watch this value and call refetch() when it changes.
 */
export const DashboardRefreshContext = React.createContext(0);
