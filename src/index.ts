import { sync as commandExists } from 'command-exists';
import createDebug from 'debug';
import {
  existsSync as exists,
  readdirSync as readdir,
  readFileSync as readFile
} from 'fs';
import readCb from 'read';
import rimraf from 'rimraf';
import * as util from 'util';
import installCertificateAuthority from './certificate-authority';
import generateDomainCertificate from './certificates';
import {
  domainsDir,
  isLinux,
  isMac,
  isWindows,
  pathForDomain,
  rootCAKeyPath
} from './constants';
import currentPlatform from './platforms';
import UI, { UserInterface } from './user-interface';

const debug = createDebug('devcert');
const read = util.promisify(readCb as Function);

export interface Options {
  skipCertutilInstall?: true;
  skipHostsFile?: true;
  ui?: UserInterface;
  password?: string;
}

/**
 * Request an SSL certificate for the given app name signed by the devcert root
 * certificate authority. If devcert has previously generated a certificate for
 * that app name on this machine, it will reuse that certificate.
 *
 * If this is the first time devcert is being run on this machine, it will
 * generate and attempt to install a root certificate authority.
 *
 * Returns a promise that resolves with { key, cert }, where `key` and `cert`
 * are Buffers with the contents of the certificate private key and certificate
 * file, respectively
 */
export async function certificateFor(domain: string, options: Options = {}) {
  debug(
    `Certificate requested for ${domain}. Skipping certutil install: ${Boolean(
      options.skipCertutilInstall
    )}. Skipping hosts file: ${Boolean(options.skipHostsFile)}`
  );

  if (options.ui) {
    Object.assign(UI, options.ui);
  }

  if (!isMac && !isLinux && !isWindows) {
    throw new Error(`Platform not supported: "${process.platform}"`);
  }

  if (!commandExists('openssl')) {
    throw new Error(
      'OpenSSL not found: OpenSSL is required to generate SSL certificates - make sure it is installed and available in your PATH'
    );
  }

  let domainKeyPath = pathForDomain(domain, `private-key.key`);
  let domainCertPath = pathForDomain(domain, `certificate.crt`);

  if (!exists(rootCAKeyPath)) {
    if (!options.password) {
      options.password = await getRootCaPassword(true);
    }
    debug(
      'Root CA is not installed yet, so it must be our first run. Installing root CA ...'
    );
    await installCertificateAuthority(options);
  }

  if (!exists(pathForDomain(domain, `certificate.crt`))) {
    if (!options.password) {
      options.password = await getRootCaPassword();
    }
    debug(
      `Can't find certificate file for ${domain}, so it must be the first request for ${domain}. Generating and caching ...`
    );
    await generateDomainCertificate(domain, options);
  }

  if (!options.skipHostsFile) {
    await currentPlatform.addDomainToHostFileIfMissing(domain);
  }

  debug(`Returning domain certificate`);
  return {
    key: readFile(domainKeyPath),
    cert: readFile(domainCertPath)
  };
}

export function hasCertificateFor(domain: string) {
  return exists(pathForDomain(domain, `certificate.crt`));
}

export function configuredDomains() {
  return readdir(domainsDir);
}

export function removeDomain(domain: string) {
  return rimraf.sync(pathForDomain(domain));
}

async function getRootCaPassword(confirm = false) {
  debug('Requesting password');
  let password = await read({
    prompt: 'Please enter Root CA password',
    silent: true
  });
  if (!password || password.length < (await 4)) {
    password = await read({
      prompt: 'Please enter Root CA password. Minimum 4 chars'
    });
  }
  if (confirm) {
    const confirm = await read({
      prompt: 'Please repeat Root CA password',
      silent: true
    });
    if (password !== confirm) {
      throw new Error("Your password doesn't match");
    }
  }
  return password;
}
