#!/usr/bin/env bash
set -euo pipefail

# Publish only the reusable components/ subtree, never the showcase application.
# Run this from a clean checkout of oxenn_components/main after component PRs merge.

SOURCE_BRANCH="main"
SOURCE_PREFIX="components"
DIST_BRANCH="oxenn-components-dist"
REMOTE="${OXENN_COMPONENTS_REMOTE:-origin}"

fail() {
  printf 'publish-components-subtree: %s\n' "$1" >&2
  exit 1
}

ROOT="$(git rev-parse --show-toplevel 2>/dev/null)" || fail "run this script from inside a Git repository."
cd "$ROOT"

CURRENT_BRANCH="$(git branch --show-current)"
[[ "$CURRENT_BRANCH" == "$SOURCE_BRANCH" ]] || fail "expected branch '$SOURCE_BRANCH', found '$CURRENT_BRANCH'."

[[ -z "$(git status --porcelain)" ]] || fail "working tree is not clean; commit or discard local changes first."
[[ -d "$SOURCE_PREFIX" ]] || fail "source directory '$SOURCE_PREFIX' does not exist."
git remote get-url "$REMOTE" >/dev/null 2>&1 || fail "Git remote '$REMOTE' is not configured."
git fetch "$REMOTE" "$SOURCE_BRANCH" --quiet || fail "could not fetch $REMOTE/$SOURCE_BRANCH."
LOCAL_HEAD="$(git rev-parse HEAD)"
REMOTE_HEAD="$(git rev-parse FETCH_HEAD)"
[[ "$LOCAL_HEAD" == "$REMOTE_HEAD" ]] || fail "local main must exactly match $REMOTE/$SOURCE_BRANCH; run git pull --ff-only and retry."

# git subtree split produces a commit whose tree is the contents of components/.
# A normal push is intentional: never overwrite a divergent distribution branch.
SPLIT_SHA="$(git subtree split --prefix="$SOURCE_PREFIX" HEAD)" || fail "git subtree split failed; ensure git-subtree is installed."
[[ -n "$SPLIT_SHA" ]] || fail "git subtree split returned an empty commit."

git push "$REMOTE" "$SPLIT_SHA:refs/heads/$DIST_BRANCH"
printf 'Published %s from %s@%s to %s/%s\n' "$SOURCE_PREFIX" "$SOURCE_BRANCH" "$SPLIT_SHA" "$REMOTE" "$DIST_BRANCH"
