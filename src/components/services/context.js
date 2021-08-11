//Service for storing the session and passing to all components (isAuthenticated, userHasAuthenticated
//will be passed to all wrapped child components in App.js)
import { useContext, createContext } from 'react';

//Create the Service
export const Context = createContext(null);

//React Hook to use the new service
export function useAppContext() {
    return useContext(Context);
}