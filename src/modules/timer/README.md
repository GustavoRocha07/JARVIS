# Timer module

HU 06.2 state flow:

`IDLE -> RUNNING(FOCUS) -> PAUSED -> RUNNING(FOCUS) -> WAITING_BREAK -> RUNNING(BREAK) -> FINISHED -> IDLE`

A single `TimerProvider` owns the active session. Tasks only select which entity should open the timer UI; the active timer target belongs to the timer domain.
