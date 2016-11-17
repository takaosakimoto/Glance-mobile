#!/usr/bin/env bash

target_dir="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
app_conf_target=$target_dir/app/providers/config.ts
ionic1_conf_target=$target_dir/ionic.config.json
ionic2_conf_target=$target_dir/ionic.project

# Optionally configure us to run as a HTTP proxy. This allows us to avoid CORS problems in browser mode
ionic_proxy="";
ionic_proxy_url="";

if [ "$IONIC_USE_PROXY" = "true" ]
then
    ionic_proxy_url="${GLANCE_API:?required}"

    ionic_proxy="{
      \"path\": \"/api\",
      \"proxyUrl\": \"$ionic_proxy_url\"
    }";

    # Override the app configuration so it goes to the proxy
          GLANCE_API="https://serve.glanceon.com";
          # GLANCE_API="https://serve.glanceon.com/staging";
       # GLANCE_API="https://glance.jond3k.com";
        # GLANCE_API="https://staging.glance.jond3k.com";
        # GLANCE_API="/api";

fi;

# Create the ionic config file
ionic_conf="{
  \"name\": \"${IONIC_APP_NAME:?required}\",
  \"app_id\": \"${IONIC_APP_ID:?required}\",
  \"v2\": true,
  \"typescript\": true,
  \"proxies\": [
    $ionic_proxy
  ]
}
";

# Create the  configuration
app_conf="//Automatically generated on `date` by `whoami`
import {Injectable} from '@angular/core';

@Injectable()
export class ClientConfig {
    public baseUrl: string = '${GLANCE_API:?required}';
    public appName: string = '${IONIC_APP_NAME:?required}';
    public build = {
        counter: '$GO_PIPELINE_LABEL',
        env_name: '$GO_ENVIRONMENT_NAME',
        server_counter: '$GO_DEPENDENCY_LABEL_GLANCE_SERVER',
        app_counter: '$GO_DEPENDENCY_LABEL_GLANCE_APP'
    };
}
";

echo "$app_conf" > $app_conf_target
echo "$ionic_conf" > $ionic1_conf_target
echo "$ionic_conf" > $ionic2_conf_target

echo "$IONIC_APP_NAME configured to point to $GLANCE_API [Proxy: $ionic_proxy_url]"
