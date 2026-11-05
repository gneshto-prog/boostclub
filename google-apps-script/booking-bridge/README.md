# Booking bridge (Google Apps Script)

boostclub.ro/book needs to read Gabi's free/busy time and write one event per booking. Google will
not issue a service-account key for the club's project, so this small script runs as
gneshto@gmail.com instead and the site talks to it with a shared secret.

## Gabi's one-time setup (about 5 minutes, his account, his clicks)
1. Open https://script.google.com signed in as gneshto@gmail.com, **New project**, name it
   `Boost Club booking bridge`.
2. Project Settings: tick "Show appsscript.json". Replace `appsscript.json` and `Code.gs` with the
   two files in this folder.
3. The secret: either Kai's private copy of Code.gs (secret already inside, kept in
   ~/.config/boostclub, never in the repo), or Project Settings, Script Properties `BRIDGE_SECRET` = the
   value in Netlify `BOOKING_BRIDGE_SECRET`.
   Calendar API: left sidebar Services +, Google Calendar API, Add (or paste appsscript.json).
4. Deploy, New deployment, type Web app, Execute as **Me**, Who has access **Anyone**. Authorize
   (Google shows "unverified app" because it is your own script: Advanced, Go to project, Allow).
5. Copy the Web app URL. It goes into Netlify as `BOOKING_BRIDGE_URL`.

What "Anyone" means here: anyone can reach the URL, but without the secret every call returns
FORBIDDEN, and with it the script can only list busy times and add a "Consultation with ..." event.

To revoke: change BRIDGE_SECRET (instantly breaks the site's access) or archive the deployment.
