#!/usr/bin/env bash


read -p "Enter your username: " username

user_pool_id=$(cat ./amplify/backend/amplify-meta.json | jq -r ".auth.nvsociallisteninguia7866996.output.UserPoolId")


echo "Enabling username: aws cognito-idp admin-enable-user --user-pool-id $user_pool_id --username $username"
aws cognito-idp admin-enable-user --user-pool-id $user_pool_id --username $username

echo "Confirming username: aws cognito-idp admin-confirm-sign-up --user-pool $user_pool_id --username $username"
aws cognito-idp admin-confirm-sign-up --user-pool $user_pool_id --username $username