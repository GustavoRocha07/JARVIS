import type { AlertContextValue } from "@/types/Alert.type";
import { useContext } from "react";
import { AlertContext } from "./AlertContext";

export function useAlert(): AlertContextValue {
    const ctx = useContext(AlertContext);
    if (!ctx) {
        throw new Error('useAlert deve ser usado dentro de <AlertProvider>');
    }
    return ctx;
}