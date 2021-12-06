# Setting up

```
# Clone repo
> git clone https://github.com/sebastianlzy/nv-social-listening-ui

```

## Remove account specific files (Optional)

```
# Remove any existing configuration
> rm ./amplify/team-provider-info.json

# Remove AWS profile
> vim ./amplify/.config/local-aws-info.json
```

## Provision backend resources
```
> amplify init --app https://github.com/sebastianlzy/social-listening-ui
```


## Provision hosting
```
> amplify add hosting

? Select the plugin module to execute Hosting with Amplify Console (Managed hosting with custom domains, Continuous deployment)
? Choose a type Continuous deployment (Git-based deployments)

//unfortunately, the connection to the github repo will still need to be done using the AWS console. 
// Follow the instruction to connect to your chosen version control
```

![Amplify add hosting](./README/amplify-add-hosting.png)

## Setup rewrites and redirect

<details>
  <summary>Using AWS CLI</summary>

   ```
    > export APP_ID=$(aws amplify list-apps --query 'apps[?name==`nvsociallisteningui`].appId' --output text)
    > echo '[{"source": "</^[^.]+$|\\\.(?!(css|gif|ico|jpg|js|png|txt|svg|woff|woff2|ttf|map|json)$)([^.]+$)/>","target": "/index.html","status": "200"}]' > custom-rules.json 
    > aws amplify update-app --app-id $APP_ID --custom-rules file://custom-rules.json
   
   ```
</details>

<details>
  <summary>Using AWS Console</summary>

![Amplify add hosting](./README/add-rewrites-and-redirects-1.png)

```
Source address: </^[^.]+$|\.(?!(css|gif|ico|jpg|js|png|txt|svg|woff|woff2|ttf|map|json)$)([^.]+$)/>
Target address: /index.html
Type: 200(Rewrite)
```

![Amplify add hosting](./README/add-rewrites-and-redirects-2.png)

</details>



# Getting started

To run locally

```
> npm run start

open https://localhost:3000
```

# Test

## Mock lambda function
```
> cd amplify/backend/function/nvsocialsettingslambda/src

// List out all the test events
> cat package.json | jq ".scripts"  

//Run test
> npm run test:getRecentMentions
```

## Run test
```
> npm run test

Watch Usage: Press w to show more.
 PASS  src/components/dashboard/chart/index.test.js
  ✓ test creation of data for dashboard (3 ms)

Test Suites: 1 passed, 1 total
Tests:       1 passed, 1 total
Snapshots:   0 total
Time:        3.867 s
Ran all test suites related to changed files.

Watch Usage: Press w to show more.



```