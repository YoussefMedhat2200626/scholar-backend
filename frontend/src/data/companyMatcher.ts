/**
 * Canonical matcher mapping raw company name strings to one of the 18 tracked company IDs.
 * Returns null if the company is not one of the 18 tracked companies.
 */
export function matchCompanyId(companyName?: string | null): string | null {
  if (!companyName) return null;
  const name = companyName.trim();
  const lower = name.toLowerCase();

  // 1. Siemens entities (specific subsidiaries checked first)
  if (lower.includes("siemens energy")) return "siemens-energy";
  if (lower.includes("siemens gamesa")) return "siemens-gamesa";
  if (
    lower.includes("siemens digital industries") ||
    lower.includes("siemens dis") ||
    lower.includes("siemens eda") ||
    lower.includes("mentor graphics")
  ) {
    return "siemens-dis";
  }
  if (lower.includes("siemens")) return "siemens";

  // 2. STMicroelectronics
  if (lower.includes("stmicro") || lower.includes("st micro")) {
    return "stmicroelectronics";
  }

  // 3. MediaTek
  if (lower.includes("mediatek")) return "mediatek";

  // 4. Analog Devices (ADI) - word boundary for ADI
  if (lower.includes("analog devices") || /\badi\b/i.test(name)) {
    return "analog-devices";
  }

  // 5. Intel Corporation - word boundary
  if (/\bintel\b/i.test(name)) return "intel";

  // 6. Texas Instruments (TI) - word boundary for TI
  if (lower.includes("texas instruments") || /\bti\b/i.test(name)) {
    return "texas-instruments";
  }

  // 7. Infineon Technologies
  if (lower.includes("infineon")) return "infineon";

  // 8. Capgemini
  if (lower.includes("capgemini")) return "capgemini";

  // 9. Cisco - word boundary to avoid "San Francisco"
  if (/\bcisco\b/i.test(name)) return "cisco";

  // 10. InfiniLink
  if (lower.includes("infinilink")) return "infinilink";

  // 11. Valeo - word boundary
  if (/\bvaleo\b/i.test(name)) return "valeo";

  // 12. Dell Technologies - word boundary to avoid "model", "delivery"
  if (/\bdell\b/i.test(name)) return "dell";

  // 13. Vodafone (_VOIS)
  if (lower.includes("vodafone") || /\b_?vois\b/i.test(name)) {
    return "vodafone";
  }

  // 14. ISS INTERNATIONAL SpA
  if (lower.includes("iss international")) return "iss-international";

  // 15. Mixel-Egypt
  if (lower.includes("mixel")) return "mixel";

  return null;
}
