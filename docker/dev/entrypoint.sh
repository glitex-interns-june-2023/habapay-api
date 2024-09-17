#!/bin/sh

# Wait for the MySQL server to be available
until mysql -h db -u root -p${MYSQL_ROOT_PASS} -e "SELECT 1" > /dev/null 2>&1; do
  echo "Waiting for MySQL server to be available..."
  sleep 2
done

# Create the development user if it doesn't exist
mysql -h db -u root -p${MYSQL_ROOT_PASS} <<-EOSQL
  CREATE USER IF NOT EXISTS '${DB_USER}'@'%' IDENTIFIED BY '${DB_PASS}';
  GRANT ALL PRIVILEGES ON ${DB_NAME}.* TO '${DB_USER}'@'%';
  FLUSH PRIVILEGES;
EOSQL

# Execute the command passed to the entrypoint
exec "$@"
