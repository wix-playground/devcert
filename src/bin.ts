#!/usr/bin/env node

import createDebug from 'debug';
import { writeFileSync } from 'fs';
import { sync } from 'glob';
import * as yargs from 'yargs';
import { Arguments, Argv } from 'yargs';
import { certificateFor } from './index';

const debug = createDebug('devcert');

yargs
  .command(
    'certificate-for <domain>',
    'generate certificate for domain',
    (yargs: Argv) =>
      yargs
        .positional('domain', {
          describe: 'domain certificate'
        })
        .option('skip-hosts-file', {
          describe:
            "If present will skip adding domain to hosts file if it doesn't exists",
          type: 'boolean'
        })
        .option('copy-to-yoshi', {
          describe: 'output keys to yoshi project',
          type: 'boolean'
        }),
    async (argv: Arguments) => {
      const { key, cert } = await certificateFor(argv.domain, {
        skipHostsFile: argv.skipHostFile
      });
      if (argv.copyToYoshi) {
        const root = '{../node_modules,node_modules}/yoshi';
        sync(`${root}/**/cert.pem`)
          .forEach((filePath: string) => {
            debug(`Copied cert to ${filePath}`);
            writeFileSync(filePath, cert, { encoding: 'utf8' });
          });
        sync(`${root}/**/key.pem`)
          .forEach((filePath: string) => {
            debug(`Copied key to ${filePath}`);
            writeFileSync(filePath, key, { encoding: 'utf8' });
          });
      }
    }
  )
  .usage('$0 <command>').argv;
