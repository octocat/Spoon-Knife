#!/usr/bin env bash

#forked_repo=$(git config --get remote.origin.url | sed -e 's/^git@.*:\([[:graph:]]*\).git/\1/')
#forked_feature_branch=$forked_repo:$(git rev-parse --abbrev-ref HEAD)
#upstream_repo=$(git config --get remote.upstream.url | sed -e 's/^git@.*:\([[:graph:]]*\).git/\1/')
#upstream_branch=$upstream_repo:main

#echo $forked_repo
#echo $upstream_branch
#echo $forked_feature_branch

gh pr create --repo "octocat/Spoon-Knife" --body "testing pr from fork" --title "test"

  #--repo octocat/Spoon-Knifeerictome-db \
#  --head robkisk/Spoon-Knife \
  #--head "feature-rk" \
