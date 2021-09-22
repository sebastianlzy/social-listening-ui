# Getting Started 

To run locally

```
> npm run start

open https://localhost:3000
```


To test lambda function
```
> cd amplify/backend/function/nvsocialsettingslambda/src

// List out all the test events
> cat package.json | jq ".scripts"  

//Run test
> npm run test:getRecentMentions
```

# Setting up in the same account (i.e. collaboration)

```

```

# Setting up in new AWS account 

```
# Remove existing configuration
> rm ./amplify/team-provider-info.json

# Initialize a new amplify env
> amplify init

# Re-provision backend infrastructure
> amplify push

# Re-provision hosting
> amplify add hosting
```

