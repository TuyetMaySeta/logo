#!/bin/sh
echo "🚀 Starting EMS Frontend Server..."

echo "🔧 Injecting environment variables..."

# Build JSON config dynamically from all VITE_ and NODE_ENV variables
CONFIG_JSON="{"
FIRST=true

# Process all environment variables
for var in $(env | grep -E "^VITE_|^NODE_ENV" | cut -d= -f1); do
  value=$(eval echo "\$$var")
  if [ -n "$value" ]; then
    if [ "$FIRST" = true ]; then
      FIRST=false
    else
      CONFIG_JSON="$CONFIG_JSON,"
    fi
    CONFIG_JSON="$CONFIG_JSON\"$var\":\"$value\""
    echo "   $var: $value"
  fi
done

CONFIG_JSON="$CONFIG_JSON}"

echo "📝 Injecting config into HTML..."
# Inject the JSON config directly into HTML
sed -i "s|</head>|<script>window.__ENV__=$CONFIG_JSON;</script></head>|g" /app/dist/index.html

echo "🌐 Starting server on port 4173..."
exec serve -s /app/dist -l 4173
