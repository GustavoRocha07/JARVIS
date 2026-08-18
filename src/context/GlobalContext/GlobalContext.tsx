import type { ReactNode } from "react"
import { AlertProvider } from "../AlertContext/AlertProvider";


type GlobalProviderType = {
    children: ReactNode;
}



export const GlobalProvider = ({ children }: GlobalProviderType) => {


    return (
        <AlertProvider>
            {children}
        </AlertProvider>
    );
};
