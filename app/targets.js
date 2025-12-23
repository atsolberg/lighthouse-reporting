const base = 'https://www.acmecorp.com';

export const targetEnum = {
  [`${base}`]: {
    id: 1,
    color: '#DA70D6',
    label: 'Home page',
    userDataTarget: true,
  },
  [`${base}?skip3p`]: {
    id: 2,
    color: '#87CEEB',
    label: 'Home page - skip3p',
  },
  [`${base}/categories/beds-on-sale`]: {
    id: 3,
    color: '#ADFF2F',
    label: 'Sale page',
    userDataTarget: true,
  },
  [`${base}/categories/beds-on-sale?skip3p`]: {
    id: 4,
    color: '#7FFFD4',
    label: 'Sale page - skip3p',
  },
  [`${base}/categories/bedding`]: {
    id: 7,
    color: '#FFA07A',
    label: 'Super category',
  },
  [`${base}/categories/bedding?skip3p`]: {
    id: 8,
    color: '#20B2AA',
    label: 'Super category - skip3p',
  },
  [`${base}/categories/mattresses`]: {
    id: 9,
    color: '#BA55D3',
    label: 'Sblp',
    userDataTarget: true,
  },
  [`${base}/categories/mattresses?skip3p`]: {
    id: 10,
    color: '#F08080',
    label: 'Sblp - skip3p',
  },
  [`${base}/categories/mattresses-performance-series?tab=config`]: {
    id: 11,
    color: '#00FF00',
    label: 'Series pdp',
  },
  [`${base}/categories/mattresses-performance-series?tab=config&skip3p`]: {
    id: 12,
    color: '#4682B4',
    label: 'Series pdp - skip3p',
  },
  [`${base}/products/c2`]: {
    id: 13,
    color: '#FF69B4',
    label: 'Mattress pdp',
    userDataTarget: true,
  },
  [`${base}/products/c2?skip3p`]: {
    id: 14,
    color: '#00FA9A',
    label: 'Mattress pdp - skip3p',
  },
  [`${base}/products/lyocell-ultra-sheets-set`]: {
    id: 15,
    color: '#1E90FF',
    label: 'Bedding pdp',
  },
  [`${base}/products/lyocell-ultra-sheets-set?skip3p`]: {
    id: 16,
    color: '#FFDAB9',
    label: 'Bedding pdp - skip3p',
  },
};

export const userDataTargets = Object.fromEntries(
  Object.entries(targetEnum).filter(([, v]) => v.userDataTarget)
);

export function getTargetById(id) {
  return Object.entries(targetEnum).find(([, v]) => v.id === id)?.[0];
}
