export const INDONESIA_DIAL_CODE = "62";

export function extractIndonesiaLocalWhatsapp(
  raw: string | null | undefined
): string {
  const digits = (raw ?? "").replaceAll(/\D/g, "");
  if (!digits) {
    return "";
  }
  const withoutDial =
    digits.startsWith(INDONESIA_DIAL_CODE) &&
    digits.length > INDONESIA_DIAL_CODE.length
      ? digits.slice(INDONESIA_DIAL_CODE.length)
      : digits;
  return withoutDial.replace(/^0+/, "");
}

export function processIndonesiaWhatsappInput(
  rawInput: string,
  maxTotalDigits = 15
): { localNumber: string; fullValue: string } {
  const trimmed = rawInput.trim();
  let digits = trimmed.replaceAll(/\D/g, "");
  const hasPlus62 = trimmed.startsWith("+62");
  const isPastedWith62 =
    digits.startsWith(INDONESIA_DIAL_CODE) &&
    (hasPlus62 ||
      (digits.startsWith("628") && digits.length >= 4) ||
      digits.length >= 9);

  if (isPastedWith62) {
    digits = digits.slice(INDONESIA_DIAL_CODE.length);
  }

  const maxLocal = Math.max(1, maxTotalDigits - INDONESIA_DIAL_CODE.length);
  const localNumber = digits.replace(/^0+/, "").slice(0, maxLocal);

  return {
    localNumber,
    fullValue:
      localNumber.length > 0 ? `${INDONESIA_DIAL_CODE}${localNumber}` : "",
  };
}
