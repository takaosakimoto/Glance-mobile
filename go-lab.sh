#!/usr/bin/env bash

# Temporary run script until Ionic2 properly runs before:serve

echo Running as "$USER" groups $(groups)

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

gulp build

ionic serve --consolelogs --serverlogs --nobrowser --nolivereload --nogulp --lab --all

