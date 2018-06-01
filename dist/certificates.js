"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
// import path from 'path';
const debug_1 = tslib_1.__importDefault(require("debug"));
const fs_1 = require("fs");
const mkdirp_1 = require("mkdirp");
const certificate_authority_1 = require("./certificate-authority");
const constants_1 = require("./constants");
const utils_1 = require("./utils");
const debug = debug_1.default('devcert:certificates');
/**
 * Generate a domain certificate signed by the devcert root CA. Domain
 * certificates are cached in their own directories under
 * CONFIG_ROOT/domains/<domain>, and reused on subsequent requests. Because the
 * individual domain certificates are signed by the devcert root CA (which was
 * added to the OS/browser trust stores), they are trusted.
 */
function generateDomainCertificate(domain, options = {}) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        mkdirp_1.sync(constants_1.pathForDomain(domain));
        debug(`Generating private key for ${domain}`);
        let domainKeyPath = constants_1.pathForDomain(domain, 'private-key.key');
        generateKey(domainKeyPath);
        debug(`Generating certificate signing request for ${domain}`);
        let csrFile = constants_1.pathForDomain(domain, `certificate-signing-request.csr`);
        constants_1.withDomainSigningRequestConfig(domain, (configpath) => {
            utils_1.openssl(`req -new -config "${configpath}" -key "${domainKeyPath}" -out "${csrFile}"`);
        });
        debug(`Generating certificate for ${domain} from signing request and signing with root CA`);
        let domainCertPath = constants_1.pathForDomain(domain, `certificate.crt`);
        yield certificate_authority_1.withCertificateAuthorityCredentials(({ caKeyPath, caCertPath }) => {
            constants_1.withDomainCertificateConfig(domain, (domainCertConfigPath) => {
                utils_1.openssl(`ca -passin pass:${options.password} -config "${domainCertConfigPath}" -in "${csrFile}" -out "${domainCertPath}" -keyfile "${caKeyPath}" -cert "${caCertPath}" -days 7000 -batch`);
            });
        });
    });
}
exports.default = generateDomainCertificate;
// Generate a cryptographic key, used to sign certificates or certificate signing requests.
function generateKey(filename, { password } = {}) {
    debug(`generateKey: ${filename}`);
    utils_1.openssl([
        `genrsa`,
        `-out "${filename}"`,
        password && `-aes128 -passout pass:${password}`,
        `2048`
    ]
        .filter(Boolean)
        .join(' '));
    fs_1.chmodSync(filename, 400);
}
exports.generateKey = generateKey;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2VydGlmaWNhdGVzLmpzIiwic291cmNlUm9vdCI6Ii9ob21lL3BldGVyay9wcm9qZWN0cy9kZXZjZXJ0LyIsInNvdXJjZXMiOlsiY2VydGlmaWNhdGVzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLDJCQUEyQjtBQUMzQiwwREFBZ0M7QUFDaEMsMkJBQXdDO0FBQ3hDLG1DQUF3QztBQUN4QyxtRUFBOEU7QUFDOUUsMkNBSXFCO0FBRXJCLG1DQUFrQztBQUVsQyxNQUFNLEtBQUssR0FBRyxlQUFXLENBQUMsc0JBQXNCLENBQUMsQ0FBQztBQUVsRDs7Ozs7O0dBTUc7QUFDSCxtQ0FDRSxNQUFjLEVBQ2QsVUFBbUIsRUFBRTs7UUFFckIsYUFBTSxDQUFDLHlCQUFhLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztRQUU5QixLQUFLLENBQUMsOEJBQThCLE1BQU0sRUFBRSxDQUFDLENBQUM7UUFDOUMsSUFBSSxhQUFhLEdBQUcseUJBQWEsQ0FBQyxNQUFNLEVBQUUsaUJBQWlCLENBQUMsQ0FBQztRQUM3RCxXQUFXLENBQUMsYUFBYSxDQUFDLENBQUM7UUFFM0IsS0FBSyxDQUFDLDhDQUE4QyxNQUFNLEVBQUUsQ0FBQyxDQUFDO1FBQzlELElBQUksT0FBTyxHQUFHLHlCQUFhLENBQUMsTUFBTSxFQUFFLGlDQUFpQyxDQUFDLENBQUM7UUFDdkUsMENBQThCLENBQUMsTUFBTSxFQUFFLENBQUMsVUFBVSxFQUFFLEVBQUU7WUFDcEQsZUFBTyxDQUNMLHFCQUFxQixVQUFVLFdBQVcsYUFBYSxXQUFXLE9BQU8sR0FBRyxDQUM3RSxDQUFDO1FBQ0osQ0FBQyxDQUFDLENBQUM7UUFFSCxLQUFLLENBQ0gsOEJBQThCLE1BQU0sZ0RBQWdELENBQ3JGLENBQUM7UUFDRixJQUFJLGNBQWMsR0FBRyx5QkFBYSxDQUFDLE1BQU0sRUFBRSxpQkFBaUIsQ0FBQyxDQUFDO1FBRTlELE1BQU0sMkRBQW1DLENBQUMsQ0FBQyxFQUFFLFNBQVMsRUFBRSxVQUFVLEVBQUUsRUFBRSxFQUFFO1lBQ3RFLHVDQUEyQixDQUFDLE1BQU0sRUFBRSxDQUFDLG9CQUFvQixFQUFFLEVBQUU7Z0JBQzNELGVBQU8sQ0FDTCxtQkFDRSxPQUFPLENBQUMsUUFDVixhQUFhLG9CQUFvQixVQUFVLE9BQU8sV0FBVyxjQUFjLGVBQWUsU0FBUyxZQUFZLFVBQVUscUJBQXFCLENBQy9JLENBQUM7WUFDSixDQUFDLENBQUMsQ0FBQztRQUNMLENBQUMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQztDQUFBO0FBaENELDRDQWdDQztBQUVELDJGQUEyRjtBQUMzRixxQkFDRSxRQUFnQixFQUNoQixFQUFFLFFBQVEsS0FBNEIsRUFBRTtJQUV4QyxLQUFLLENBQUMsZ0JBQWdCLFFBQVEsRUFBRSxDQUFDLENBQUM7SUFDbEMsZUFBTyxDQUNMO1FBQ0UsUUFBUTtRQUNSLFNBQVMsUUFBUSxHQUFHO1FBQ3BCLFFBQVEsSUFBSSx5QkFBeUIsUUFBUSxFQUFFO1FBQy9DLE1BQU07S0FDUDtTQUNFLE1BQU0sQ0FBQyxPQUFPLENBQUM7U0FDZixJQUFJLENBQUMsR0FBRyxDQUFDLENBQ2IsQ0FBQztJQUNGLGNBQUssQ0FBQyxRQUFRLEVBQUUsR0FBRyxDQUFDLENBQUM7QUFDdkIsQ0FBQztBQWhCRCxrQ0FnQkMiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBpbXBvcnQgcGF0aCBmcm9tICdwYXRoJztcbmltcG9ydCBjcmVhdGVEZWJ1ZyBmcm9tICdkZWJ1Zyc7XG5pbXBvcnQgeyBjaG1vZFN5bmMgYXMgY2htb2QgfSBmcm9tICdmcyc7XG5pbXBvcnQgeyBzeW5jIGFzIG1rZGlycCB9IGZyb20gJ21rZGlycCc7XG5pbXBvcnQgeyB3aXRoQ2VydGlmaWNhdGVBdXRob3JpdHlDcmVkZW50aWFscyB9IGZyb20gJy4vY2VydGlmaWNhdGUtYXV0aG9yaXR5JztcbmltcG9ydCB7XG4gIHBhdGhGb3JEb21haW4sXG4gIHdpdGhEb21haW5DZXJ0aWZpY2F0ZUNvbmZpZyxcbiAgd2l0aERvbWFpblNpZ25pbmdSZXF1ZXN0Q29uZmlnXG59IGZyb20gJy4vY29uc3RhbnRzJztcbmltcG9ydCB7IE9wdGlvbnMgfSBmcm9tICcuL2luZGV4JztcbmltcG9ydCB7IG9wZW5zc2wgfSBmcm9tICcuL3V0aWxzJztcblxuY29uc3QgZGVidWcgPSBjcmVhdGVEZWJ1ZygnZGV2Y2VydDpjZXJ0aWZpY2F0ZXMnKTtcblxuLyoqXG4gKiBHZW5lcmF0ZSBhIGRvbWFpbiBjZXJ0aWZpY2F0ZSBzaWduZWQgYnkgdGhlIGRldmNlcnQgcm9vdCBDQS4gRG9tYWluXG4gKiBjZXJ0aWZpY2F0ZXMgYXJlIGNhY2hlZCBpbiB0aGVpciBvd24gZGlyZWN0b3JpZXMgdW5kZXJcbiAqIENPTkZJR19ST09UL2RvbWFpbnMvPGRvbWFpbj4sIGFuZCByZXVzZWQgb24gc3Vic2VxdWVudCByZXF1ZXN0cy4gQmVjYXVzZSB0aGVcbiAqIGluZGl2aWR1YWwgZG9tYWluIGNlcnRpZmljYXRlcyBhcmUgc2lnbmVkIGJ5IHRoZSBkZXZjZXJ0IHJvb3QgQ0EgKHdoaWNoIHdhc1xuICogYWRkZWQgdG8gdGhlIE9TL2Jyb3dzZXIgdHJ1c3Qgc3RvcmVzKSwgdGhleSBhcmUgdHJ1c3RlZC5cbiAqL1xuZXhwb3J0IGRlZmF1bHQgYXN5bmMgZnVuY3Rpb24gZ2VuZXJhdGVEb21haW5DZXJ0aWZpY2F0ZShcbiAgZG9tYWluOiBzdHJpbmcsXG4gIG9wdGlvbnM6IE9wdGlvbnMgPSB7fVxuKTogUHJvbWlzZTx2b2lkPiB7XG4gIG1rZGlycChwYXRoRm9yRG9tYWluKGRvbWFpbikpO1xuXG4gIGRlYnVnKGBHZW5lcmF0aW5nIHByaXZhdGUga2V5IGZvciAke2RvbWFpbn1gKTtcbiAgbGV0IGRvbWFpbktleVBhdGggPSBwYXRoRm9yRG9tYWluKGRvbWFpbiwgJ3ByaXZhdGUta2V5LmtleScpO1xuICBnZW5lcmF0ZUtleShkb21haW5LZXlQYXRoKTtcblxuICBkZWJ1ZyhgR2VuZXJhdGluZyBjZXJ0aWZpY2F0ZSBzaWduaW5nIHJlcXVlc3QgZm9yICR7ZG9tYWlufWApO1xuICBsZXQgY3NyRmlsZSA9IHBhdGhGb3JEb21haW4oZG9tYWluLCBgY2VydGlmaWNhdGUtc2lnbmluZy1yZXF1ZXN0LmNzcmApO1xuICB3aXRoRG9tYWluU2lnbmluZ1JlcXVlc3RDb25maWcoZG9tYWluLCAoY29uZmlncGF0aCkgPT4ge1xuICAgIG9wZW5zc2woXG4gICAgICBgcmVxIC1uZXcgLWNvbmZpZyBcIiR7Y29uZmlncGF0aH1cIiAta2V5IFwiJHtkb21haW5LZXlQYXRofVwiIC1vdXQgXCIke2NzckZpbGV9XCJgXG4gICAgKTtcbiAgfSk7XG5cbiAgZGVidWcoXG4gICAgYEdlbmVyYXRpbmcgY2VydGlmaWNhdGUgZm9yICR7ZG9tYWlufSBmcm9tIHNpZ25pbmcgcmVxdWVzdCBhbmQgc2lnbmluZyB3aXRoIHJvb3QgQ0FgXG4gICk7XG4gIGxldCBkb21haW5DZXJ0UGF0aCA9IHBhdGhGb3JEb21haW4oZG9tYWluLCBgY2VydGlmaWNhdGUuY3J0YCk7XG5cbiAgYXdhaXQgd2l0aENlcnRpZmljYXRlQXV0aG9yaXR5Q3JlZGVudGlhbHMoKHsgY2FLZXlQYXRoLCBjYUNlcnRQYXRoIH0pID0+IHtcbiAgICB3aXRoRG9tYWluQ2VydGlmaWNhdGVDb25maWcoZG9tYWluLCAoZG9tYWluQ2VydENvbmZpZ1BhdGgpID0+IHtcbiAgICAgIG9wZW5zc2woXG4gICAgICAgIGBjYSAtcGFzc2luIHBhc3M6JHtcbiAgICAgICAgICBvcHRpb25zLnBhc3N3b3JkXG4gICAgICAgIH0gLWNvbmZpZyBcIiR7ZG9tYWluQ2VydENvbmZpZ1BhdGh9XCIgLWluIFwiJHtjc3JGaWxlfVwiIC1vdXQgXCIke2RvbWFpbkNlcnRQYXRofVwiIC1rZXlmaWxlIFwiJHtjYUtleVBhdGh9XCIgLWNlcnQgXCIke2NhQ2VydFBhdGh9XCIgLWRheXMgNzAwMCAtYmF0Y2hgXG4gICAgICApO1xuICAgIH0pO1xuICB9KTtcbn1cblxuLy8gR2VuZXJhdGUgYSBjcnlwdG9ncmFwaGljIGtleSwgdXNlZCB0byBzaWduIGNlcnRpZmljYXRlcyBvciBjZXJ0aWZpY2F0ZSBzaWduaW5nIHJlcXVlc3RzLlxuZXhwb3J0IGZ1bmN0aW9uIGdlbmVyYXRlS2V5KFxuICBmaWxlbmFtZTogc3RyaW5nLFxuICB7IHBhc3N3b3JkIH06IHsgcGFzc3dvcmQ/OiBzdHJpbmcgfSA9IHt9XG4pOiB2b2lkIHtcbiAgZGVidWcoYGdlbmVyYXRlS2V5OiAke2ZpbGVuYW1lfWApO1xuICBvcGVuc3NsKFxuICAgIFtcbiAgICAgIGBnZW5yc2FgLFxuICAgICAgYC1vdXQgXCIke2ZpbGVuYW1lfVwiYCxcbiAgICAgIHBhc3N3b3JkICYmIGAtYWVzMTI4IC1wYXNzb3V0IHBhc3M6JHtwYXNzd29yZH1gLFxuICAgICAgYDIwNDhgXG4gICAgXVxuICAgICAgLmZpbHRlcihCb29sZWFuKVxuICAgICAgLmpvaW4oJyAnKVxuICApO1xuICBjaG1vZChmaWxlbmFtZSwgNDAwKTtcbn1cbiJdfQ==