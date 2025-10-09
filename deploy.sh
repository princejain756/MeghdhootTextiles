#!/bin/bash

# Build the project
echo "Building the project..."
npm run build

if [ $? -eq 0 ]; then
    echo "Build successful! Copying files to web server..."
    
    # Remove old files but keep .well-known for SSL certificates
    find /var/www/meghdoottextiles.com -mindepth 1 -not -path "/var/www/meghdoottextiles.com/.well-known*" -delete
    
    # Copy new build files
    cp -r dist/* /var/www/meghdoottextiles.com/
    
    # Set proper permissions
    chown -R www-data:www-data /var/www/meghdoottextiles.com/
    chmod -R 644 /var/www/meghdoottextiles.com/
    find /var/www/meghdoottextiles.com -type d -exec chmod 755 {} \;
    
    echo "Deployment complete!"
    echo "Website updated at: https://meghdoottextiles.com"
else
    echo "Build failed. Deployment aborted."
    exit 1
fi
