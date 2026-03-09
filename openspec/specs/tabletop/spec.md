# Tabletop

## Requirement: Bootstrap a playable tabletop session
The system SHALL bootstrap into a running tabletop session with an active map, an active round, and an initial token selection.

#### Scenario: Initial session state is ready
- GIVEN the application builds a fresh Bevy app
- WHEN the app runs its startup and update cycle
- THEN the engine phase is `Running`
- AND an active map is available
- AND turn order contains combatants
- AND a token is already selected

## Requirement: Board selection updates the active token summary
The system SHALL let board selection commands change which token is active in the shared selection state.

#### Scenario: Selecting a different token from the board
- GIVEN the app has finished bootstrapping
- WHEN a board selection command targets another token
- THEN that token becomes the selected entity

## Requirement: Queued movement updates token position and measured distance
The system SHALL resolve queued movement commands by moving the targeted token and updating the tracked movement distance.

#### Scenario: Moving the selected token
- GIVEN the app has a selected token on the board
- WHEN a movement command queues a new board destination for that token
- THEN the token ends at the requested grid position
- AND the selection state records the measured move distance
- AND the save state is marked dirty

## Requirement: Queued dice rolls are recorded in history
The system SHALL resolve queued dice rolls into the dice history log.

#### Scenario: Rolling labeled dice
- GIVEN the app has finished bootstrapping
- WHEN a labeled dice roll queues one or more dice with a modifier
- THEN a dice log entry is added to history
- AND the entry preserves the roll label, rolled values, and total
