#!/bin/bash
set -e

source .env

if [[ -z "$VAULT_PATH" ]]; then
  echo "Path to Vault is not set!"
  exit;
fi

PLUGIN_PATH=$VAULT_PATH/.obsidian/plugins/obsidian-inline-bible
TMP_PATH=$(mktemp -d 2>/dev/null || mktemp -d -t 'mytmpdir')
PACK_OUTPUT=( $(npm pack) );

PACK_NAME=${PACK_OUTPUT[${#PACK_OUTPUT[@]}-1]};
tar -xvzf $PACK_NAME -C $TMP_PATH --strip-components=1
rm $PACK_NAME;

if [[ -e $PLUGIN_PATH/data.json ]]; then
  cp -f $PLUGIN_PATH/data.json $TMP_PATH/data.json
fi;

echo $TMP_PATH
echo $PLUGIN_PATH

rm -rf $PLUGIN_PATH
mv $TMP_PATH $PLUGIN_PATH

