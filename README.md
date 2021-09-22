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

# Setting up in new account

```
> amplify init

# Re-provision backend infrastructure
> amplify push

# Re-provision hosting
> amplify add hosting

# On console, connect front-end to repository
# Things to note: 
#    1. Create a service role for amplify
