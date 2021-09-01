#!/usr/bin/env bash


read -p "Enter your username: " username
echo $username

aws cognito-idp admin-enable-user --user-pool-id nvsociallisteninguia7866996_userpool_a7866996-dev --username $username