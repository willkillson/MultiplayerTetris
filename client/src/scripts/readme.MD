# Explanation of custom node.js scripts

## copyScript.js
This script is run when `npm start` is invoked. It copies over whatever is in the common folders in the root to the project before running.

## copyToCommon.js
This script is run when `npm run dev` is invoked. It copies over whatever is in the local common folder to the root common folder so we don't 
have to manually copy this over every time we change the local common folder when developing.