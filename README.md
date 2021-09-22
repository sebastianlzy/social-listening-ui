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

```

# Setting up in the same account (i.e. collaboration)

```
# Clone repo
> git clone https://github.com/sebastianlzy/nv-social-listening-ui

# Setup amplify to sync with upstream changes
> amplify pull
```

# Setting up in new AWS account 

```

# Clone repo
> git clone https://github.com/sebastianlzy/nv-social-listening-ui

# Remove existing configuration
> rm ./amplify/team-provider-info.json

# Update AWS profile
> vim ./amplify/.config/local-aws-info.json

# Initialize a new amplify env
> amplify init

# Re-provision backend infrastructure
> amplify push

# Re-provision hosting
> amplify add hosting

# On console, connect front-end to repository
# Things to note: 
#    1. Create a service role for amplify

```