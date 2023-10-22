import * as os from "os";
import * as crypto from "crypto";

function getMac(): string | null {
  const networkInterfaces = os.networkInterfaces();
  const defaultInterface =
    networkInterfaces["Wi-Fi"] || networkInterfaces["Ethernet"];

  if (defaultInterface) {
    return defaultInterface[0].mac || null;
  } else {
    console.error("MAC address not found.");
    return null;
  }
}

function createHash(string: string): string {
  return crypto.createHash("md5").update(string).digest("hex");
}
function createVerificationToken(): string {
  return crypto.randomBytes(40).toString("hex");
}
function generateRefreshToken(): string {
  return crypto.randomBytes(40).toString("hex");
}

export { getMac, createHash, createVerificationToken, generateRefreshToken };
