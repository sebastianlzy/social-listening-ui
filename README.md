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
```