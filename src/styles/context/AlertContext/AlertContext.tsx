
import type { AlertContextValue,  } from "@/types/Alert.type";
import { createContext, } from "react";


export const AlertContext = createContext<AlertContextValue | undefined>(undefined)


