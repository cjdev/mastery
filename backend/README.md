# Mastery

## LDAP Credentials

The app needs LDAP credentials passed on startup and looks for them in the following progression:

1. In the MASTERY_LDAPUSER and MASTERY_LDAPPASSWORD environment variables.
2. As the first two command line arguments passed to the app.
3. If the credentials are not found, the app will prompt for the credentials interactively.
