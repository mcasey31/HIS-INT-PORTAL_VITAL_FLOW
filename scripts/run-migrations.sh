#!/bin/bash
set -e

# ================================================
# Run all migration files in order
# ================================================
# This runs after init-db.sql (schemas created)
# Iterates /migrations/*.sql sorted alphabetically

echo "Running database migrations..."

for f in $(ls /migrations/*.sql | sort); do
    echo "  -> $(basename $f)"
    psql -v ON_ERROR_STOP=1 \
         --username "$POSTGRES_USER" \
         --dbname "$POSTGRES_DB" \
         -f "$f"
done

echo "All migrations completed successfully."
