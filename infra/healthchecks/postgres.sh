#!/bin/bash
set -eo pipefail

host="$(hostname -i || echo '127.0.0.1')"
user="${DATABASE_USERNAME:-postgres}"
db="${DATABASE_NAME_DB:-$POSTGRES_USER}"
export PGPASSWORD="${DATABASE_PASSWORD:-}"

args=(
	# force postgres to not use the local unix socket (test "external" connectibility)
	--host "$host"
	--username "$user"
	--dbname "$db"
	--quiet --no-align --tuples-only
)

if select="$(echo 'SELECT 1' | psql "${args[@]}")" && [ "$select" = '1' ]; then
	exit 0
fi

exit 1