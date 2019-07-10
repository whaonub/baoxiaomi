'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
    NODE_ENV: '"development"',
    dev: '"dev"',
    test: '"test"',
    policyService: '"policyService"',
    familyService: '"familyService"',
    insuranceService: '"insuranceService"',
    vcardService: '"vcardService"',
    authService: '"authService"',
    agentService: '"agentService"',
    userService: '"userService"',
});