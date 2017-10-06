# Offline, mobile ESV Bible

A [progressive web app](https://en.wikipedia.org/wiki/Progressive_web_app) built with [create-react-app](https://github.com/facebookincubator/create-react-app) that uses the [ESV V2 API](http://www.esvapi.org/api/). Content is cached for offline use.

[![Build Status](https://travis-ci.org/esvbible/esvbible.github.io.svg?branch=dev)](https://travis-ci.org/esvbible/esvbible.github.io)

## Development

### Set up

Get [yarn](https://yarnpkg.com/en/) and run:

    yarn install
    
### Dev server and tooling

Start the dev server and open http://localhost:3000

    yarn start
    
You can also optionally start the type checker and unit tests (in separate terminals, since they've got watchers):

    yarn typecheck
    yarn test
    
## Deploying

Push to the `dev` branch and wait for [the Travis build](https://travis-ci.org/esvbible/esvbible.github.io) to run.

## Credits

Search icon made by <a href="https://www.flaticon.com/authors/lucy-g" title="Lucy G">Lucy G</a> from <a href="https://www.flaticon.com/" title="Flaticon">www.flaticon.com</a> is licensed by <a href="http://creativecommons.org/licenses/by/3.0/" title="Creative Commons BY 3.0" target="_blank">CC 3.0 BY</a></div>
