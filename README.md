# Groak
## For deploying cloud functions
For deploying firebase functions go to Groak_Cloud_Functions folder and use the command:
    
    firebase deploy --only functions
## For deploying react app to firebase hosting
Open visual studio code and where you run, npm start, there only run:

    npm run build
    firebase deploy --only hosting:groak-test
    firebase deploy --only hosting:groak-1
