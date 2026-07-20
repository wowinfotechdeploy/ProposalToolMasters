import Decimal from "decimal.js";

Decimal.set({
  precision: 40,
  rounding: Decimal.ROUND_HALF_UP,
});

export const decimalValue = (value) => {
  if (value === null || value === undefined || value === "") {
    return new Decimal(0);
  }

  const cleanedValue =
    typeof value === "string" ? value.replace(/,/g, "") : value;

  try {
    return new Decimal(cleanedValue);
  } catch {
    return new Decimal(0);
  }
};

export const truncateMoney = (value) => {
  return decimalValue(value).toDecimalPlaces(2, Decimal.ROUND_DOWN).toNumber();
};

export const calc2 = (value) => {
  const num = Number(value || 0);
  return Math.trunc(num * 100) / 100;
};

export const calc2Fixed = (value) => calc2(value).toFixed(2);

export function truncateVAT(value) {
  return Math.trunc(Number(value || 0) * 100) / 100;
}

export const round2 = (value) => {
  return Number(Number(value || 0).toFixed(2));
};

export const truncate2 = (value) => {
  return Math.trunc(Number(value || 0) * 100) / 100;
};

// export const safeNumber = (value) => {
//   return Number(value || 0);
// };

export const safeNumber = (value) => {
  const cleanedValue =
    typeof value === "string" ? value.replace(/,/g, "") : value;

  const numberValue = Number(cleanedValue);

  return Number.isFinite(numberValue) ? numberValue : 0;
};

// All monetary calculations are performed in cents.
export const toCents = (value) => {
  return Math.round(safeNumber(value) * 100);
};

export const fromCents = (value) => {
  return Number((value / 100).toFixed(2));
};

export const calculateVatCents = (amountCents, vatPercentage) => {
  return Math.round((amountCents * safeNumber(vatPercentage)) / 100);
};

/**
 * Calculates the custom template footer.
 *
 * Net values come from the service rows and therefore remain unchanged
 * when the discount or discounted price changes.
 *
 * Discounted VAT is calculated by proportionally distributing the
 * discounted fees across the service rows. This also supports different
 * VAT percentages for individual services.
 */
export const calculateCustomRecurringFooter = ({
  serviceGroups = [],
  discountedPrice = 0,
  fallbackVatPercentage = 0,
}) => {
  const rows = serviceGroups.flatMap((category) =>
    (category.servicesList || []).map((service) => {
      const fees = decimalValue(service.price);

      const vatRate = decimalValue(
        service.service_vat_percentage ?? fallbackVatPercentage,
      );

      // Do not round here.
      const vat = fees.mul(vatRate).div(100);

      return {
        fees,
        vat,
        vatRate,
      };
    }),
  );

  /*
   * Constant original values.
   * Full service precision is retained until the final result.
   */
  const netFeesExact = rows.reduce(
    (total, row) => total.plus(row.fees),
    new Decimal(0),
  );

  const netVatExact = rows.reduce(
    (total, row) => total.plus(row.vat),
    new Decimal(0),
  );

  const netFeesIncVatExact = netFeesExact.plus(netVatExact);

  /*
   * Discounted fees entered or calculated by the user.
   */
  const discountedFeesExact = decimalValue(discountedPrice);

  /*
   * Calculate VAT using the effective VAT ratio.
   *
   * This supports multiple VAT rates and avoids distributing and
   * rounding the discount individually across every service.
   */
  const effectiveVatRatio = netFeesExact.isZero()
    ? new Decimal(0)
    : netVatExact.div(netFeesExact);

  const discountedVatExact = discountedFeesExact.mul(effectiveVatRatio);

  const discountedFeesIncVatExact =
    discountedFeesExact.plus(discountedVatExact);

  /*
   * Discounts are calculated from the exact values,
   * not from already-rounded footer amounts.
   */
  const discountFeesExact = netFeesExact.minus(discountedFeesExact);

  const discountVatExact = netVatExact.minus(discountedVatExact);

  const discountFeesIncVatExact = netFeesIncVatExact.minus(
    discountedFeesIncVatExact,
  );

  return {
    // Net Total row — remains constant
    netFees: truncateMoney(netFeesExact),
    netVat: truncateMoney(netVatExact),
    netFeesIncVat: truncateMoney(netFeesIncVatExact),

    // Discount row
    discountFees: truncateMoney(discountFeesExact),
    discountVat: truncateMoney(discountVatExact),
    discountFeesIncVat: truncateMoney(discountFeesIncVatExact),

    // Grand Total row
    discountedFees: truncateMoney(discountedFeesExact),
    discountedVat: truncateMoney(discountedVatExact),
    discountedFeesIncVat: truncateMoney(discountedFeesIncVatExact),
  };
};

export const calculateCustomOneOffFooter = ({
  serviceGroups = [],
  discountedPrice = 0,
  fallbackVatPercentage = 0,
}) => {
  const rows = serviceGroups.flatMap((category) =>
    (category.servicesList || []).map((service) => {
      const feesExact = decimalValue(service.price);

      const vatRateExact = decimalValue(
        service.service_vat_percentage ?? fallbackVatPercentage,
      );

      const vatExact = feesExact.mul(vatRateExact).div(100);

      return {
        feesExact,
        vatExact,
      };
    }),
  );

  /*
   * Constant net values.
   * These values only change when the service list changes.
   */
  const netFeesExact = rows.reduce(
    (total, row) => total.plus(row.feesExact),
    new Decimal(0),
  );

  const netVatExact = rows.reduce(
    (total, row) => total.plus(row.vatExact),
    new Decimal(0),
  );

  const netFeesIncVatExact = netFeesExact.plus(netVatExact);

  /*
   * Changeable discounted values.
   */
  const discountedFeesExact = decimalValue(discountedPrice);

  /*
   * Supports both common and service-wise VAT rates.
   */
  const effectiveVatRatio = netFeesExact.isZero()
    ? new Decimal(0)
    : netVatExact.div(netFeesExact);

  const discountedVatExact = discountedFeesExact.mul(effectiveVatRatio);

  const discountedFeesIncVatExact =
    discountedFeesExact.plus(discountedVatExact);

  /*
   * Calculate discounts from exact values.
   * Never subtract displayed or already-truncated values.
   */
  const discountFeesExact = netFeesExact.minus(discountedFeesExact);

  const discountVatExact = netVatExact.minus(discountedVatExact);

  const discountFeesIncVatExact = netFeesIncVatExact.minus(
    discountedFeesIncVatExact,
  );

  return {
    // Net Total row
    netFees: truncateMoney(netFeesExact),
    netVat: truncateMoney(netVatExact),
    netFeesIncVat: truncateMoney(netFeesIncVatExact),

    // Discount row
    discountFees: truncateMoney(discountFeesExact),
    discountVat: truncateMoney(discountVatExact),
    discountFeesIncVat: truncateMoney(discountFeesIncVatExact),

    // Grand Total row
    discountedFees: truncateMoney(discountedFeesExact),
    discountedVat: truncateMoney(discountedVatExact),
    discountedFeesIncVat: truncateMoney(discountedFeesIncVatExact),

    hasDiscount: discountFeesExact.greaterThan(0),
    hasPriceIncrease: discountFeesExact.lessThan(0),
  };
};
