import React from 'react';

interface OverlayContextValue {
  overlayVisible: boolean;
  setOverlayVisible: (visible: boolean) => void;
}

const OverlayContext = React.createContext<OverlayContextValue>({
  overlayVisible: false,
  setOverlayVisible: () => {},
});

export const OverlayProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [overlayVisible, setOverlayVisible] = React.useState(false);

  const value = React.useMemo(
    () => ({ overlayVisible, setOverlayVisible }),
    [overlayVisible],
  );

  return (
    <OverlayContext.Provider value={value}>{children}</OverlayContext.Provider>
  );
};

export const useOverlay = () => React.useContext(OverlayContext);
