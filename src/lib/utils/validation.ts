export const validateTCKN = (tckn: string): boolean => {
  if (!/^\d{11}$/.test(tckn)) return false;

  const digits = tckn.split('').map(Number);

  if (digits[0] === 0) return false;

  const sum1 = (digits[0] + digits[2] + digits[4] + digits[6] + digits[8]) * 7;
  const sum2 = digits[1] + digits[3] + digits[5] + digits[7];
  const digit10 = (sum1 - sum2) % 10;

  if (digit10 !== digits[9]) return false;

  const sum3 = digits.slice(0, 10).reduce((a, b) => a + b, 0);
  const digit11 = sum3 % 10;

  return digit11 === digits[10];
};

export const validateIBAN = (iban: string): boolean => {
  const cleaned = iban.replace(/\s/g, '').toUpperCase();

  if (!/^TR\d{2}\d{5}0\d{16}$/.test(cleaned)) return false;

  const rearranged = cleaned.slice(4) + cleaned.slice(0, 4);

  const numericString = rearranged.replace(/[A-Z]/g, (char) =>
    (char.charCodeAt(0) - 55).toString()
  );

  let remainder = '';
  for (const digit of numericString) {
    remainder = (parseInt(remainder + digit, 10) % 97).toString();
  }

  return parseInt(remainder, 10) === 1;
};

export const validatePlate = (plate: string): boolean => {
  const plateRegex = /^(0[1-9]|[1-7][0-9]|8[01])\s?[A-Z]{1,3}\s?\d{2,4}$/i;
  return plateRegex.test(plate.trim());
};

export const validatePhone = (phone: string): boolean => {
  const cleaned = phone.replace(/\D/g, '');
  return cleaned.length === 10 && /^[5][0-9]{9}$/.test(cleaned);
};

export const validatePostalCode = (code: string): boolean => {
  return /^\d{5}$/.test(code);
};
