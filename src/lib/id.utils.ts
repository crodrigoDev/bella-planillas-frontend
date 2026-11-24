/**
 * Genera un identificador UUID v4 compatible con contextos HTTP no seguros
 *
 * @remarks
 * `crypto.randomUUID` solo existe en HTTPS o localhost; en accesos por LAN
 * (`http://192.168.x.x`) se arma el UUID v4 con `crypto.getRandomValues`.
 */
export const generarUuid = (): string => {
  if (typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }

  const bytes = new Uint8Array(16);
  crypto.getRandomValues(bytes);
  bytes[6] = (bytes[6] & 0x0f) | 0x40;
  bytes[8] = (bytes[8] & 0x3f) | 0x80;

  const hex = Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join(
    "",
  );

  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
};
