#!/usr/bin/env node
'use strict'

/**
 * Runs `next dev` in its own build directory.
 *
 * The dev server and `next build` both write to .next by default. Running a
 * build while dev is live corrupts the dev server's webpack chunk manifest and
 * every route starts returning 500 with "Cannot find module './NNN.js'".
 *
 * Dev is the one that moves, not build: with `output: "export"` a custom
 * distDir also relocates the exported site, so the production build has to
 * keep the default for /out to be written.
 */

const { spawnSync } = require('child_process')
const path = require('path')

const result = spawnSync(
  process.execPath,
  [path.join(__dirname, '..', 'node_modules', 'next', 'dist', 'bin', 'next'), 'dev'],
  {
    stdio: 'inherit',
    cwd: path.join(__dirname, '..'),
    env: { ...process.env, NEXT_DIST_DIR: '.next-dev' },
  }
)

process.exit(result.status === null ? 1 : result.status)
