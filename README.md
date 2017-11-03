# The Everywhere Bible app

A [progressive web app](https://en.wikipedia.org/wiki/Progressive_web_app) built with [create-react-app](https://github.com/facebookincubator/create-react-app) that uses the [ESV V3 API](http://www.esvapi.org/api/). The app works offline when service workers are supported.

[![Build Status](https://travis-ci.org/everywherebible/app.svg?branch=master)](https://travis-ci.org/everywherebible/app)

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

Push to the `master` branch and wait for [the Travis build](https://travis-ci.org/everywherebible/app) to run.

There's this weird thing about the deployment: the site is hosted statically by
the https://github.com/esvbible/esvbible.github.io repository, and [fronted by
Cloudflare](https://blog.cloudflare.com/secure-and-fast-github-pages-with-cloudflare/)
at the en.everywherebible.org subdomain. The everywherebible.github.io page is
already used for the splash page explaining this project, and originally the
app was deployed to that `esvbible` org, so when it was migrated to the
`everywherebible` org, I just continued to use the original location for
hosting.

# Small print

## License

Source code [licensed under the MIT
License](/everywherebible/app/blob/dev/LICENSE).

## Credits

Scripture quotations are from the ESV® Bible (The Holy Bible, English Standard
Version®), copyright © 2001 by Crossway, a publishing ministry of Good News
Publishers. Used by permission. All rights reserved. You may not copy or
download more than 500 consecutive verses of the ESV Bible or more than one
half of any book of the ESV Bible.

Search icon made by <a href="https://www.flaticon.com/authors/lucy-g" title="Lucy G">Lucy G</a> from <a href="https://www.flaticon.com/" title="Flaticon">www.flaticon.com</a> is licensed by <a href="http://creativecommons.org/licenses/by/3.0/" title="Creative Commons BY 3.0" target="_blank">CC 3.0 BY</a></div>
