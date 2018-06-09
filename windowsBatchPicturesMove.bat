setlocal enabledelayedexpansion
for %%a in (*.jpg) do (
	SET shortName=%%~na
	SET shorterName=!shortName:~0,-4!
	MKDIR !shorterName!
	MOVE "%%~pnxa" "%%~pa!shorterName!\%%~nxa"
)
rem need %% for .bat file and !var! for enableddelayedexpansion to re-evaluate vars on every iteration, need to mkdir before move, p-path n-name x-extension
