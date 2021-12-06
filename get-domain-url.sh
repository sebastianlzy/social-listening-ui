DOMAIN_NAME=$(aws amplify list-apps --query 'apps[?name==`nvsociallisteningui`].defaultDomain' --output text)
#APP_ID=$(aws amplify list-apps --query 'apps[?name==`nvsociallisteningui`].appId' --output text)
PRODUCTION_BRANCH=$(aws amplify list-apps --query 'apps[?name==`nvsociallisteningui`].productionBranch.branchName' --output text)

echo "https://$PRODUCTION_BRANCH.$DOMAIN_NAME"