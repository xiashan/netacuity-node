# netacuity-node

A tiny Node.js module for get request's IP address and retrieval geo information.

## Installation

```bash
npm install @noxfed/netacuity-node --save
```
    
## Getting Started

```javascript
const netacuityNode = require('@noxfed/netacuity-node');

const clientInfo = await netacuityNode.getClientInfo(req, { databaseType: 3, netAcuityIp: NETACUITY });
// clientInfo:
/*
{
  'trans-id': 'DepUoE046v',
  ip: '118.26.73.210',
  country: 'chn',
  region: '###',
  city: '###',
  'conn-speed': '###',
  'country-conf': '5',
  'region-conf': '0',
  'city-conf': '0',
  'metro-code': '0',
  latitude: '0',
  longitude: '0',
  'country-code': '156',
  'region-code': '0',
  'city-code': '0',
  'continent-code': '4',
  'two-letter-country': 'cn'
}
*/
// on localhost you'll get ip as 127.0.0.1 and clientInfo['two-letter-country'] is '**'
// or ::1, ::ffff:127.0.0.1 if you're using IPv6 and clientInfo['two-letter-country'] also is '**'
```

### As Connect Middleware

```javascript
const netacuityNode = require('@noxfed/netacuity-node');
app.use(netacuityNode.mw())

app.use(function(req, res) {
    const clientInfo = await netacuityNode.getClientInfo(req, { databaseType: 3, netAcuityIp: NETACUITY });
    res.end(clientInfo);
});
```

## How It Works

1. netacuity-node based on request-ip

request-ip looks for specific headers in the request and falls back to some defaults if they do not exist.

The user ip is determined by the following order:

1. `X-Client-IP`  
2. `X-Forwarded-For` (Header may return multiple IP addresses in the format: "client IP, proxy 1 IP, proxy 2 IP", so we take the the first one.)
3. `CF-Connecting-IP` (Cloudflare)
4. `Fastly-Client-Ip` (Fastly CDN and Firebase hosting header when forwared to a cloud function)
5. `True-Client-Ip` (Akamai and Cloudflare)
6. `X-Real-IP` (Nginx proxy/FastCGI)
7. `X-Cluster-Client-IP` (Rackspace LB, Riverbed Stingray)
8. `X-Forwarded`, `Forwarded-For` and `Forwarded` (Variations of #2)
9. `req.connection.remoteAddress`
10. `req.socket.remoteAddress`
11. `req.connection.socket.remoteAddress`
12. `req.info.remoteAddress`

If an IP address cannot be found, it will return `null`.

2. node的项目一般都会有nginx反向代理，所以需要运维给nginx修改配置

## Running the Tests

Make sure you have the necessary dev dependencies needed to run the tests:

```
npm install
```

Run the integration tests

```
npm test
```

## Release Notes

See the wonderful [changelog](https://github.com/pbojinov/request-ip/blob/master/CHANGELOG.md)

To easily generate a new changelog, install [github-changelog-generator](https://github.com/skywinder/github-changelog-generator) then run `npm run changelog`.

## License

The MIT License (MIT) - 2021
