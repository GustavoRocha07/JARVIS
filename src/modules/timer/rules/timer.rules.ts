import type { TimerState } from "../types/timer.type";


export const canInitTimer = (timer: TimerState) => {

    return timer.status === 'IDLE' && !timer.target;

}