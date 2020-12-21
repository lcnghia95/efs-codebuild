# How to serup
## Development environment
Add config file to root folder `.env.local`\
Run `yarn`\
Run `npm run run:local`

Test (boilerplate route):
```
http://localhost:7990/api/surface/info?year=2014&type=1
```

## Run debug mode
### Debug on `staging` env
http://pm2.keymetrics.io/docs/usage/environment/#while-restarting-reloading-a-process
https://loopback.io/doc/en/lb2/Setting-debug-strings.html#using-debug-strings
```
cd /var/www/vhosts/api.gogojungle.co.jp
DEBUG=loopback:datasource pm2 reload api.gogojungle.co.jp_staging --update-env
```

 ### Debug on `local` env
```
npm run run:local:debug
```
