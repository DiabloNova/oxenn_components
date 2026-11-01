#!/usr/bin/env bash
set -euo pipefail

# Publish only the reusable components/ subtree, never the showcase application.
# Run this from a complete, clean checkout of oxenn_components/main.

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

# A shallow checkout cannot preserve the complete component history in subtree split.
IS_SHALLOW="$(git rev-parse --is-shallow-repository 2>/dev/null)" || fail "could not determine whether this repository is shallow."
[[ "$IS_SHALLOW" == "false" ]] || fail "shallow repositories are not supported; fetch the complete history before publishing."

git fetch "$REMOTE" "$SOURCE_BRANCH" --quiet || fail "could not fetch $REMOTE/$SOURCE_BRANCH."
LOCAL_HEAD="$(git rev-parse HEAD)"
REMOTE_HEAD="$(git rev-parse FETCH_HEAD)"
[[ "$LOCAL_HEAD" == "$REMOTE_HEAD" ]] || fail "local main must exactly match $REMOTE/$SOURCE_BRANCH; run git pull --ff-only and retry."

# Split the exact source commit that was verified above.
SPLIT_SHA="$(git subtree split --prefix="$SOURCE_PREFIX" "$LOCAL_HEAD")" || fail "git subtree split failed; ensure git-subtree is installed."
[[ -n "$SPLIT_SHA" ]] || fail "git subtree split returned an empty commit."

# Re-read main immediately before pushing. The atomic push below also includes
# main as a no-op refspec with a lease, closing the remaining TOCTOU window:
# if main moves after this check, the server rejects the entire atomic push.
LATEST_REMOTE_LINE="$(git ls-remote "$REMOTE" "refs/heads/$SOURCE_BRANCH")" || fail "could not revalidate $REMOTE/$SOURCE_BRANCH."
LATEST_REMOTE_HEAD="${LATEST_REMOTE_LINE%%[[:space:]]*}"
[[ "$LATEST_REMOTE_HEAD" == "$LOCAL_HEAD" ]] || fail "$REMOTE/$SOURCE_BRANCH changed during subtree generation; fetch, fast-forward main, and retry."

# Update the distribution branch with a normal push, never a force update.
# Git accepts this only when the remote distribution tip is an ancestor of
# SPLIT_SHA (or already equals it). A divergent/manual edit or bad publication
# is rejected rather than silently discarded. The atomic source-main no-op
# refspec uses a lease only to ensure main has not moved since validation.
git push --atomic "--force-with-lease=refs/heads/$SOURCE_BRANCH:$LOCAL_HEAD" "$REMOTE" \
  "$SPLIT_SHA:refs/heads/$DIST_BRANCH" \
  "$LOCAL_HEAD:refs/heads/$SOURCE_BRANCH"

printf 'Published %s from %s@%s to %s/%s\n' "$SOURCE_PREFIX" "$SOURCE_BRANCH" "$LOCAL_HEAD" "$REMOTE" "$DIST_BRANCH"
