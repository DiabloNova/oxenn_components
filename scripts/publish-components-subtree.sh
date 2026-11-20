#!/usr/bin/env bash
set -euo pipefail

# Publish a complete snapshot of the reusable components/ tree.
# Run from a clean, up-to-date checkout of oxenn_components/main.

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

# Verify that the local source is exactly the current remote main.
git fetch "$REMOTE" "$SOURCE_BRANCH" --quiet || fail "could not fetch $REMOTE/$SOURCE_BRANCH."
LOCAL_HEAD="$(git rev-parse HEAD)"
REMOTE_HEAD="$(git rev-parse FETCH_HEAD)"
[[ "$LOCAL_HEAD" == "$REMOTE_HEAD" ]] || fail "local main must exactly match $REMOTE/$SOURCE_BRANCH; run git pull --ff-only and retry."

# The distribution branch is a linear sequence of component-only snapshots.
# Its initial commit contains the components/ tree as its repository root.
git fetch "$REMOTE" "$DIST_BRANCH" --quiet || fail "could not fetch $REMOTE/$DIST_BRANCH; initialize the distribution branch first."
DIST_BASE_SHA="$(git rev-parse FETCH_HEAD)"
DIST_BASE_TREE="$(git rev-parse "$DIST_BASE_SHA^{tree}")"
COMPONENT_TREE="$(git rev-parse "$LOCAL_HEAD:$SOURCE_PREFIX")"

if [[ "$DIST_BASE_TREE" == "$COMPONENT_TREE" ]]; then
  printf 'No component changes to publish; %s is already current.\n' "$REMOTE/$DIST_BRANCH"
  exit 0
fi

# Revalidate both refs immediately before publishing. The atomic push also
# uses leases so a concurrent main or distribution-branch update is rejected.
LATEST_MAIN_LINE="$(git ls-remote "$REMOTE" "refs/heads/$SOURCE_BRANCH")" || fail "could not revalidate $REMOTE/$SOURCE_BRANCH."
LATEST_MAIN="${LATEST_MAIN_LINE%%[[:space:]]*}"
[[ "$LATEST_MAIN" == "$LOCAL_HEAD" ]] || fail "$REMOTE/$SOURCE_BRANCH changed during publication; fetch and fast-forward main, then retry."
LATEST_DIST_LINE="$(git ls-remote "$REMOTE" "refs/heads/$DIST_BRANCH")" || fail "could not revalidate $REMOTE/$DIST_BRANCH."
LATEST_DIST="${LATEST_DIST_LINE%%[[:space:]]*}"
[[ "$LATEST_DIST" == "$DIST_BASE_SHA" ]] || fail "$REMOTE/$DIST_BRANCH changed during publication; fetch it and retry."

SNAPSHOT_SHA="$(git -c user.name="${GIT_AUTHOR_NAME:-Oxenn Components Publisher}" \
  -c user.email="${GIT_AUTHOR_EMAIL:-121438027+DiabloNova@users.noreply.github.com}" \
  commit-tree "$COMPONENT_TREE" -p "$DIST_BASE_SHA" \
  -m "chore: publish components snapshot from $LOCAL_HEAD")" || fail "could not create the component snapshot commit."

# The main ref is sent as a no-op guarded by a lease. The distribution ref is
# a normal descendant update; neither ref is force-pushed or rewritten.
git push --atomic \
  "--force-with-lease=refs/heads/$SOURCE_BRANCH:$LOCAL_HEAD" \
  "--force-with-lease=refs/heads/$DIST_BRANCH:$DIST_BASE_SHA" \
  "$REMOTE" \
  "$SNAPSHOT_SHA:refs/heads/$DIST_BRANCH" \
  "$LOCAL_HEAD:refs/heads/$SOURCE_BRANCH"

printf 'Published %s@%s to %s/%s at %s\n' \
  "$SOURCE_PREFIX" "$LOCAL_HEAD" "$REMOTE" "$DIST_BRANCH" "$SNAPSHOT_SHA"
