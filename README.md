RetirementPlan.io - Ember Application
======================================

Develop
-------

`ember serve --proxy http://rp-rails.dev`

Build
-----

`ember build --environment=production`

Deployment
----------

Canary release: `grunt`

Production release: `grunt publish-release`

Notes
-----

- If you change `ember-simple-auth` for `torii` (or any other authentication/authorization library), you need to adjust the names of the keys set in localStorage by the `www.retirementplan.io` application. (The login modals from the marketing site navbar).
