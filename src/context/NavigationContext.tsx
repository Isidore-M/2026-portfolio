import React, { createContext, useContext, useState, type ReactNode } from 'react';

// Define the shape of our context
interface NavigationContextType {
  isDetailViewActive: boolean;
  setIsDetailViewActive: (active: boolean) => void;
  // We will expand this later to include a function that jumps to specific sections
}

const NavigationContext = createContext<NavigationContextType | undefined>(undefined);

export const NavigationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isDetailViewActive, setIsDetailViewActive] = useState(false);

  return (
    <NavigationContext.Provider value={{ isDetailViewActive, setIsDetailViewActive }}>
      {children}
    </NavigationContext.Provider>
  );
};

// Custom hook for easy consumption
// eslint-disable-next-line react-refresh/only-export-components
export const useNavigation = () => {
  const context = useContext(NavigationContext);
  if (context === undefined) {
    throw new Error('useNavigation must be used within a NavigationProvider');
  }
  return context;
};