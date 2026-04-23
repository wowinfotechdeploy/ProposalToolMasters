/**
 * Service Scope uses per-service drivers from `pricingDriverList` (catalog / quote model)
 * or `gpdList` (accepted quotation APIs, e.g. GetAcceptedQuotationServiceDetails).
 */

export function getDriversForServiceScopeRaw(subService) {
  if (!subService) return [];
  if (
    Array.isArray(subService.pricingDriverList) &&
    subService.pricingDriverList.length > 0
  ) {
    return subService.pricingDriverList;
  }
  if (Array.isArray(subService.gpdList) && subService.gpdList.length > 0) {
    return subService.gpdList;
  }
  return [];
}

/**
 * Normalize for UIs that branch on `variation === null` vs `variation` array
 * (`gpdList` often omits `variation` and supplies `variationName` instead).
 */
export function getServiceScopeDriverList(subService) {
  const raw = getDriversForServiceScopeRaw(subService);
  if (!Array.isArray(raw)) return [];
  return raw.map((d) => {
    if (!d) return d;
    if (Array.isArray(d.variation)) return d;
    const hasVariationName =
      d.variationName != null && String(d.variationName).trim() !== "";
    return {
      ...d,
      variation: null,
      driverValue: hasVariationName ? d.variationName : d.driverValue,
    };
  });
}
