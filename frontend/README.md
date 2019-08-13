## mastery-web

Front end for the mastery tool

### Running Locally

The local dev server will proxy api calls to a running mastery server found at the address in the `proxy` value in `package.json`. This value can point to a local or remote server.

```bash
$ grep \"proxy\" package.json
  "proxy": "http://localhost:9193",
$ yarn                 # install deps
$ yarn run start       # start dev server
```
