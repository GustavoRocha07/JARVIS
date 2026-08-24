import { useContext } from "react"
import { TimerContext } from "./timerContext"


export const useTimer = () => {
    const context = useContext(TimerContext);


    if (!context) {
        throw new Error(
            "useTimer deve ser utilizado dentro de um TimerProvider"
        )
    }

    return context;

}