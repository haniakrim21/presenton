#!/bin/bash
# Workaround for Electron module patching issue
# Unset ELECTRON_RUN_AS_NODE to allow proper module initialization
unset ELECTRON_RUN_AS_NODE
exec npx electron .
