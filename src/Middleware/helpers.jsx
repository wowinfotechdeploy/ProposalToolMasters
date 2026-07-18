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

export const safeNumber = (value) => {
  return Number(value || 0);
};
