DOMAIN_NAME=$(aws amplify list-apps --query 'apps[0].defaultDomain' --output text)
PRODUCTION_BRANCH=$(aws amplify list-apps --query 'apps[0].productionBranch.branchName' --output text)

echo "https://$PRODUCTION_BRANCH.$DOMAIN_NAME"