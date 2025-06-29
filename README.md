# Vulnerability Management Sample App

This app demonstrates how to use DQL to retrieve vulnerability information and display it in a Dynatrace AppEngine application.
The application shows recent vulnerabilities along with a quick action to request an exception.

## Support
Please note that the app is intended mostly for educational purposes and should not be used as-is for production scenarios. It is covered under the “light support” provisions of the Dynatrace terms and conditions.

## TL;DR
You can start using this Sample App now:
1. Clone this repo to your localhost
2. Install dependencies using `npm install`
3. Edit `env.ts` to point to your environment
   - Set the `TENANT` constant to your Dynatrace tenant ID.
   - For Dynatrace **SaaS** use the `.apps.dynatrace.com` domain. A typical configuration looks like:

     ```ts
    const TENANT = '<tenant>';
    export const ENVIRONMENT_URL = `https://${TENANT}.live.dynatrace.com/`;
    export const LATEST_DYNATRACE_ENVIRONMENT_URL = `https://${TENANT}.apps.dynatrace.com/`;
     ```

   - For Dynatrace **Labs** keep the `.dev.dynatracelabs.com` domains as provided in `env.ts`.
   
   Using the wrong URL will result in **404** responses during authentication.
4. Test locally: `npm run start`
5. Deploy using `npm run deploy`

Or, keep reading to understand how to modify this app for your own purposes or build your own.

Or, watch our Observability Clinic about this app on YouTube:
[![Observability Clinic](src/assets/observability_clinic.png 'Observability Clinic')](https://www.youtube.com/watch?v=0cbdymD_2tc)

# Query vulnerabilities with DQL

The vulnerabilities displayed in the app are retrieved from Grail using DQL. A simple query might look like:

```
fetch security.vulnerabilities
| fields timestamp, cve, processGroup, detail = title
| sort timestamp desc
```
