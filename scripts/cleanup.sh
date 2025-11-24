#!/bin/bash

# Cleanup script for removing node_modules from Git
# Run this from repository root

echo "Removing node_modules from Git tracking..."
git rm -r --cached node_modules

echo "Removing package-lock.json from Git tracking..."
git rm --cached package-lock.json

echo "Committing changes..."
git commit -m "Remove node_modules and package-lock.json from Git tracking"

echo "Pushing to remote..."
git push origin main

echo "✅ Cleanup complete!"
echo "Note: node_modules still exists in Git history."
echo "To completely remove from history, see Issue #1"