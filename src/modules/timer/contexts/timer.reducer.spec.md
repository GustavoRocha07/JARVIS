# Timer reducer acceptance scenarios

These scenarios document the reducer behaviors that should be automated when a test runner is added to the project.

- START creates a RUNNING FOCUS session with the selected target.
- PAUSE only works from RUNNING.
- RESUME only works from PAUSED.
- RESTART keeps the same target and resets the current phase duration.
- Completing FOCUS moves to WAITING_BREAK instead of starting the break automatically.
- START_BREAK moves WAITING_BREAK to a 5-minute RUNNING BREAK.
- FINISH preserves workedSeconds and marks the session FINISHED.
- SKIP_BREAK finishes only BREAK sessions.
- RESET releases the target and returns to IDLE.
- TICK does not change state outside RUNNING.
