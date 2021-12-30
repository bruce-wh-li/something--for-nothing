
readonly REQUIRED_ENV_VARS=(
  "MONGODB_USERNAME"
  "MONGODB_PASSWORD"
  )

# Verify the environment vars are set.
verify_env_vars() {
  for evar in ${REQUIRED_ENV_VARS[@]}; do
    if [[ -z "${!evar}" ]]; then
      echo "Err: The env var '$evar' must be set."
      exit 1
    fi
  done
}

init_rdbms() {
    # var rootUser = '$MONGO_INITDB_ROOT_USERNAME';
    # var rootPassword = '$MONGO_INITDB_ROOT_PASSWORD';
    # var admin = db.getSiblingDB('admin');
    # admin.auth(rootUser, rootPassword);
    echo $MONGODB_USERNAME
    echo $MONGODB_PASSWORD
mongo -- "$MONGO_INITDB_DATABASE" <<EOF
    var user = '$MONGODB_USERNAME';
    var passwd = '$MONGODB_PASSWORD';
    use codeChallenge
    db.log.insert({"name":"create db"})
    db.createUser({user: user, pwd: passwd, roles: ["readWrite"]});
    
EOF
}


main() {
  verify_env_vars
  init_rdbms
}

main "$@"
