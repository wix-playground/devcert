// import path from 'path';
import createDebug from 'debug';
import { chmodSync as chmod } from 'fs';
import { sync as mkdirp } from 'mkdirp';
import { withCertificateAuthorityCredentials } from './certificate-authority';
import {
  pathForDomain,
  withDomainCertificateConfig,
  withDomainSigningRequestConfig
} from './constants';
import { Options } from './index';
import { openssl } from './utils';

const debug = createDebug('devcert:certificates');

/**
 * Generate a domain certificate signed by the devcert root CA. Domain
 * certificates are cached in their own directories under
 * CONFIG_ROOT/domains/<domain>, and reused on subsequent requests. Because the
 * individual domain certificates are signed by the devcert root CA (which was
 * added to the OS/browser trust stores), they are trusted.
 */
export default async function generateDomainCertificate(
  domain: string,
  options: Options = {}
): Promise<void> {
  mkdirp(pathForDomain(domain));

  debug(`Generating private key for ${domain}`);
  let domainKeyPath = pathForDomain(domain, 'private-key.key');
  generateKey(domainKeyPath);

  debug(`Generating certificate signing request for ${domain}`);
  let csrFile = pathForDomain(domain, `certificate-signing-request.csr`);
  withDomainSigningRequestConfig(domain, (configpath) => {
    openssl(
      `req -new -config "${configpath}" -key "${domainKeyPath}" -out "${csrFile}"`
    );
  });

  debug(
    `Generating certificate for ${domain} from signing request and signing with root CA`
  );
  let domainCertPath = pathForDomain(domain, `certificate.crt`);

  await withCertificateAuthorityCredentials(({ caKeyPath, caCertPath }) => {
    withDomainCertificateConfig(domain, (domainCertConfigPath) => {
      openssl(
        `ca -passin pass:${
          options.password
        } -config "${domainCertConfigPath}" -in "${csrFile}" -out "${domainCertPath}" -keyfile "${caKeyPath}" -cert "${caCertPath}" -days 7000 -batch`
      );
    });
  });
}

// Generate a cryptographic key, used to sign certificates or certificate signing requests.
export function generateKey(
  filename: string,
  { password }: { password?: string } = {}
): void {
  debug(`generateKey: ${filename}`);
  openssl(
    [
      `genrsa`,
      `-out "${filename}"`,
      password && `-aes128 -passout pass:${password}`,
      `2048`
    ]
      .filter(Boolean)
      .join(' ')
  );
  chmod(filename, 400);
}
