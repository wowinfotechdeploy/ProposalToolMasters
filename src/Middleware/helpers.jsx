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
      const feesCents = toCents(service.price);

      const vatRate = safeNumber(
        service.service_vat_percentage ?? fallbackVatPercentage,
      );

      return {
        feesCents,
        vatRate,
      };
    }),
  );

  // Constant original/net values
  const netFeesCents = rows.reduce((total, row) => total + row.feesCents, 0);

  const netVatCents = rows.reduce(
    (total, row) => total + calculateVatCents(row.feesCents, row.vatRate),
    0,
  );

  const netFeesIncVatCents = netFeesCents + netVatCents;

  // Changeable discounted values
  const discountedFeesCents = toCents(discountedPrice);

  let discountedVatCents = 0;

  if (rows.length > 0 && netFeesCents !== 0) {
    let allocatedFeesCents = 0;

    rows.forEach((row, index) => {
      let rowDiscountedFeesCents;

      if (index === rows.length - 1) {
        // Assign the rounding remainder to the final row.
        rowDiscountedFeesCents = discountedFeesCents - allocatedFeesCents;
      } else {
        rowDiscountedFeesCents = Math.round(
          (discountedFeesCents * row.feesCents) / netFeesCents,
        );

        allocatedFeesCents += rowDiscountedFeesCents;
      }

      discountedVatCents += calculateVatCents(
        rowDiscountedFeesCents,
        row.vatRate,
      );
    });
  } else {
    discountedVatCents = calculateVatCents(
      discountedFeesCents,
      fallbackVatPercentage,
    );
  }

  const discountedFeesIncVatCents = discountedFeesCents + discountedVatCents;

  const discountFeesCents = netFeesCents - discountedFeesCents;

  const discountVatCents = netVatCents - discountedVatCents;

  const discountFeesIncVatCents =
    netFeesIncVatCents - discountedFeesIncVatCents;

  return {
    // Net Total row
    netFees: fromCents(netFeesCents),
    netVat: fromCents(netVatCents),
    netFeesIncVat: fromCents(netFeesIncVatCents),

    // Discount row
    discountFees: fromCents(discountFeesCents),
    discountVat: fromCents(discountVatCents),
    discountFeesIncVat: fromCents(discountFeesIncVatCents),

    // Grand Total / Discounted Total row
    discountedFees: fromCents(discountedFeesCents),
    discountedVat: fromCents(discountedVatCents),
    discountedFeesIncVat: fromCents(discountedFeesIncVatCents),
  };
};
