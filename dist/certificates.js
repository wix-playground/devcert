"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
}
Object.defineProperty(exports, "__esModule", { value: true });
// import path from 'path';
const debug_1 = __importDefault(require("debug"));
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
    return __awaiter(this, void 0, void 0, function* () {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2VydGlmaWNhdGVzLmpzIiwic291cmNlUm9vdCI6Ii9ob21lL3BldGVyay9wcm9qZWN0cy9kZXZjZXJ0LyIsInNvdXJjZXMiOlsiY2VydGlmaWNhdGVzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7QUFBQSwyQkFBMkI7QUFDM0Isa0RBQWdDO0FBQ2hDLDJCQUF3QztBQUN4QyxtQ0FBd0M7QUFDeEMsbUVBQThFO0FBQzlFLDJDQUlxQjtBQUVyQixtQ0FBa0M7QUFFbEMsTUFBTSxLQUFLLEdBQUcsZUFBVyxDQUFDLHNCQUFzQixDQUFDLENBQUM7QUFFbEQ7Ozs7OztHQU1HO0FBQ0gsbUNBQ0UsTUFBYyxFQUNkLFVBQW1CLEVBQUU7O1FBRXJCLGFBQU0sQ0FBQyx5QkFBYSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7UUFFOUIsS0FBSyxDQUFDLDhCQUE4QixNQUFNLEVBQUUsQ0FBQyxDQUFDO1FBQzlDLElBQUksYUFBYSxHQUFHLHlCQUFhLENBQUMsTUFBTSxFQUFFLGlCQUFpQixDQUFDLENBQUM7UUFDN0QsV0FBVyxDQUFDLGFBQWEsQ0FBQyxDQUFDO1FBRTNCLEtBQUssQ0FBQyw4Q0FBOEMsTUFBTSxFQUFFLENBQUMsQ0FBQztRQUM5RCxJQUFJLE9BQU8sR0FBRyx5QkFBYSxDQUFDLE1BQU0sRUFBRSxpQ0FBaUMsQ0FBQyxDQUFDO1FBQ3ZFLDBDQUE4QixDQUFDLE1BQU0sRUFBRSxDQUFDLFVBQVUsRUFBRSxFQUFFO1lBQ3BELGVBQU8sQ0FDTCxxQkFBcUIsVUFBVSxXQUFXLGFBQWEsV0FBVyxPQUFPLEdBQUcsQ0FDN0UsQ0FBQztRQUNKLENBQUMsQ0FBQyxDQUFDO1FBRUgsS0FBSyxDQUNILDhCQUE4QixNQUFNLGdEQUFnRCxDQUNyRixDQUFDO1FBQ0YsSUFBSSxjQUFjLEdBQUcseUJBQWEsQ0FBQyxNQUFNLEVBQUUsaUJBQWlCLENBQUMsQ0FBQztRQUU5RCxNQUFNLDJEQUFtQyxDQUFDLENBQUMsRUFBRSxTQUFTLEVBQUUsVUFBVSxFQUFFLEVBQUUsRUFBRTtZQUN0RSx1Q0FBMkIsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxvQkFBb0IsRUFBRSxFQUFFO2dCQUMzRCxlQUFPLENBQ0wsbUJBQ0UsT0FBTyxDQUFDLFFBQ1YsYUFBYSxvQkFBb0IsVUFBVSxPQUFPLFdBQVcsY0FBYyxlQUFlLFNBQVMsWUFBWSxVQUFVLHFCQUFxQixDQUMvSSxDQUFDO1lBQ0osQ0FBQyxDQUFDLENBQUM7UUFDTCxDQUFDLENBQUMsQ0FBQztJQUNMLENBQUM7Q0FBQTtBQWhDRCw0Q0FnQ0M7QUFFRCwyRkFBMkY7QUFDM0YscUJBQ0UsUUFBZ0IsRUFDaEIsRUFBRSxRQUFRLEtBQTRCLEVBQUU7SUFFeEMsS0FBSyxDQUFDLGdCQUFnQixRQUFRLEVBQUUsQ0FBQyxDQUFDO0lBQ2xDLGVBQU8sQ0FDTDtRQUNFLFFBQVE7UUFDUixTQUFTLFFBQVEsR0FBRztRQUNwQixRQUFRLElBQUkseUJBQXlCLFFBQVEsRUFBRTtRQUMvQyxNQUFNO0tBQ1A7U0FDRSxNQUFNLENBQUMsT0FBTyxDQUFDO1NBQ2YsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUNiLENBQUM7SUFDRixjQUFLLENBQUMsUUFBUSxFQUFFLEdBQUcsQ0FBQyxDQUFDO0FBQ3ZCLENBQUM7QUFoQkQsa0NBZ0JDIiwic291cmNlc0NvbnRlbnQiOlsiLy8gaW1wb3J0IHBhdGggZnJvbSAncGF0aCc7XG5pbXBvcnQgY3JlYXRlRGVidWcgZnJvbSAnZGVidWcnO1xuaW1wb3J0IHsgY2htb2RTeW5jIGFzIGNobW9kIH0gZnJvbSAnZnMnO1xuaW1wb3J0IHsgc3luYyBhcyBta2RpcnAgfSBmcm9tICdta2RpcnAnO1xuaW1wb3J0IHsgd2l0aENlcnRpZmljYXRlQXV0aG9yaXR5Q3JlZGVudGlhbHMgfSBmcm9tICcuL2NlcnRpZmljYXRlLWF1dGhvcml0eSc7XG5pbXBvcnQge1xuICBwYXRoRm9yRG9tYWluLFxuICB3aXRoRG9tYWluQ2VydGlmaWNhdGVDb25maWcsXG4gIHdpdGhEb21haW5TaWduaW5nUmVxdWVzdENvbmZpZ1xufSBmcm9tICcuL2NvbnN0YW50cyc7XG5pbXBvcnQgeyBPcHRpb25zIH0gZnJvbSAnLi9pbmRleCc7XG5pbXBvcnQgeyBvcGVuc3NsIH0gZnJvbSAnLi91dGlscyc7XG5cbmNvbnN0IGRlYnVnID0gY3JlYXRlRGVidWcoJ2RldmNlcnQ6Y2VydGlmaWNhdGVzJyk7XG5cbi8qKlxuICogR2VuZXJhdGUgYSBkb21haW4gY2VydGlmaWNhdGUgc2lnbmVkIGJ5IHRoZSBkZXZjZXJ0IHJvb3QgQ0EuIERvbWFpblxuICogY2VydGlmaWNhdGVzIGFyZSBjYWNoZWQgaW4gdGhlaXIgb3duIGRpcmVjdG9yaWVzIHVuZGVyXG4gKiBDT05GSUdfUk9PVC9kb21haW5zLzxkb21haW4+LCBhbmQgcmV1c2VkIG9uIHN1YnNlcXVlbnQgcmVxdWVzdHMuIEJlY2F1c2UgdGhlXG4gKiBpbmRpdmlkdWFsIGRvbWFpbiBjZXJ0aWZpY2F0ZXMgYXJlIHNpZ25lZCBieSB0aGUgZGV2Y2VydCByb290IENBICh3aGljaCB3YXNcbiAqIGFkZGVkIHRvIHRoZSBPUy9icm93c2VyIHRydXN0IHN0b3JlcyksIHRoZXkgYXJlIHRydXN0ZWQuXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGFzeW5jIGZ1bmN0aW9uIGdlbmVyYXRlRG9tYWluQ2VydGlmaWNhdGUoXG4gIGRvbWFpbjogc3RyaW5nLFxuICBvcHRpb25zOiBPcHRpb25zID0ge31cbik6IFByb21pc2U8dm9pZD4ge1xuICBta2RpcnAocGF0aEZvckRvbWFpbihkb21haW4pKTtcblxuICBkZWJ1ZyhgR2VuZXJhdGluZyBwcml2YXRlIGtleSBmb3IgJHtkb21haW59YCk7XG4gIGxldCBkb21haW5LZXlQYXRoID0gcGF0aEZvckRvbWFpbihkb21haW4sICdwcml2YXRlLWtleS5rZXknKTtcbiAgZ2VuZXJhdGVLZXkoZG9tYWluS2V5UGF0aCk7XG5cbiAgZGVidWcoYEdlbmVyYXRpbmcgY2VydGlmaWNhdGUgc2lnbmluZyByZXF1ZXN0IGZvciAke2RvbWFpbn1gKTtcbiAgbGV0IGNzckZpbGUgPSBwYXRoRm9yRG9tYWluKGRvbWFpbiwgYGNlcnRpZmljYXRlLXNpZ25pbmctcmVxdWVzdC5jc3JgKTtcbiAgd2l0aERvbWFpblNpZ25pbmdSZXF1ZXN0Q29uZmlnKGRvbWFpbiwgKGNvbmZpZ3BhdGgpID0+IHtcbiAgICBvcGVuc3NsKFxuICAgICAgYHJlcSAtbmV3IC1jb25maWcgXCIke2NvbmZpZ3BhdGh9XCIgLWtleSBcIiR7ZG9tYWluS2V5UGF0aH1cIiAtb3V0IFwiJHtjc3JGaWxlfVwiYFxuICAgICk7XG4gIH0pO1xuXG4gIGRlYnVnKFxuICAgIGBHZW5lcmF0aW5nIGNlcnRpZmljYXRlIGZvciAke2RvbWFpbn0gZnJvbSBzaWduaW5nIHJlcXVlc3QgYW5kIHNpZ25pbmcgd2l0aCByb290IENBYFxuICApO1xuICBsZXQgZG9tYWluQ2VydFBhdGggPSBwYXRoRm9yRG9tYWluKGRvbWFpbiwgYGNlcnRpZmljYXRlLmNydGApO1xuXG4gIGF3YWl0IHdpdGhDZXJ0aWZpY2F0ZUF1dGhvcml0eUNyZWRlbnRpYWxzKCh7IGNhS2V5UGF0aCwgY2FDZXJ0UGF0aCB9KSA9PiB7XG4gICAgd2l0aERvbWFpbkNlcnRpZmljYXRlQ29uZmlnKGRvbWFpbiwgKGRvbWFpbkNlcnRDb25maWdQYXRoKSA9PiB7XG4gICAgICBvcGVuc3NsKFxuICAgICAgICBgY2EgLXBhc3NpbiBwYXNzOiR7XG4gICAgICAgICAgb3B0aW9ucy5wYXNzd29yZFxuICAgICAgICB9IC1jb25maWcgXCIke2RvbWFpbkNlcnRDb25maWdQYXRofVwiIC1pbiBcIiR7Y3NyRmlsZX1cIiAtb3V0IFwiJHtkb21haW5DZXJ0UGF0aH1cIiAta2V5ZmlsZSBcIiR7Y2FLZXlQYXRofVwiIC1jZXJ0IFwiJHtjYUNlcnRQYXRofVwiIC1kYXlzIDcwMDAgLWJhdGNoYFxuICAgICAgKTtcbiAgICB9KTtcbiAgfSk7XG59XG5cbi8vIEdlbmVyYXRlIGEgY3J5cHRvZ3JhcGhpYyBrZXksIHVzZWQgdG8gc2lnbiBjZXJ0aWZpY2F0ZXMgb3IgY2VydGlmaWNhdGUgc2lnbmluZyByZXF1ZXN0cy5cbmV4cG9ydCBmdW5jdGlvbiBnZW5lcmF0ZUtleShcbiAgZmlsZW5hbWU6IHN0cmluZyxcbiAgeyBwYXNzd29yZCB9OiB7IHBhc3N3b3JkPzogc3RyaW5nIH0gPSB7fVxuKTogdm9pZCB7XG4gIGRlYnVnKGBnZW5lcmF0ZUtleTogJHtmaWxlbmFtZX1gKTtcbiAgb3BlbnNzbChcbiAgICBbXG4gICAgICBgZ2VucnNhYCxcbiAgICAgIGAtb3V0IFwiJHtmaWxlbmFtZX1cImAsXG4gICAgICBwYXNzd29yZCAmJiBgLWFlczEyOCAtcGFzc291dCBwYXNzOiR7cGFzc3dvcmR9YCxcbiAgICAgIGAyMDQ4YFxuICAgIF1cbiAgICAgIC5maWx0ZXIoQm9vbGVhbilcbiAgICAgIC5qb2luKCcgJylcbiAgKTtcbiAgY2htb2QoZmlsZW5hbWUsIDQwMCk7XG59XG4iXX0=