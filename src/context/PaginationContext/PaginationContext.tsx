import { createContext } from "react";
import type { PaginationContextValue, } from "./PaginationContext.type";

export const PaginationContext = createContext<PaginationContextValue | undefined>(undefined)

