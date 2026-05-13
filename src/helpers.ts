export const isClient = () => typeof window !== 'undefined';

export const chunk = <T>(arr: T[], size: number): T[][] => {
  const res: T[][] = [];

  for (let i = 0; i < arr.length; i += size) {
    res.push(arr.slice(i, i + size));
  }

  return res;
};

export const formatNumber = (num: number, options?: Intl.NumberFormatOptions) =>
  new Intl.NumberFormat('en-US', options).format(num);
