'use strict';

const gulp = require('gulp')
const fs = require('fs')
const path = require('path')
const find = require('find')
const build = require('@microsoft/sp-build-web')

build.addSuppression(`Warning - [sass] The local CSS class 'ms-Grid' is not camelCase and will not be type-safe.`)

build.initialize(gulp)

gulp.task('versionSync', (done) => {
    find.file(/\manifest.json$/, path.join(__dirname, "src"), (files) => {
        var pkgSolution = require('./config/package-solution.json')
        var newVersionNumber = require('./package.json').version.split('-')[0]
        pkgSolution.solution.version = newVersionNumber + '.0'
        fs.writeFile('./config/package-solution.json', JSON.stringify(pkgSolution, null, 4), (_error) => { })
        for (let i = 0; i < files.length; i++) {
            let manifest = require(files[i])
            manifest.version = newVersionNumber
            fs.writeFile(files[i], JSON.stringify(manifest, null, 4), (_error) => { })
        }
        done()
    })
})

build.tslintCmd.enabled = false