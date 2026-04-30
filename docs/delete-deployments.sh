prod_id=""
while :; do
  ids=$(npx wrangler pages deployment list --project-name bobmonsour-com --json | jq -r '.[].Id')
  to_delete=$(echo "$ids" | grep -v -F -x "$prod_id" | grep .)
  [ -z "$to_delete" ] && { echo "Done. Production: $prod_id"; break; }
  echo "Deleting $(echo "$to_delete" | wc -l | tr -d ' ') deployments..."
  while IFS= read -r id; do
    if ! npx wrangler pages deployment delete "$id" --project-name bobmonsour-com --force 2>&1 | tee /tmp/wrangler-del.log | grep -q "Successfully deleted"; then
      grep -q "active production deployment" /tmp/wrangler-del.log && prod_id="$id"
    fi
  done <<< "$to_delete"
done
