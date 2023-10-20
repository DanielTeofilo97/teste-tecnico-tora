export function isValidCPF(cpf: string): boolean {

    cpf = cpf.replace(/[.-]/g, '');
  
    if (cpf.length !== 11) {
      return false;
    }
  
    if (/^(\d)\1{10}$/.test(cpf)) {
      return false;
    }
  
    const firstNineDigits = cpf.substr(0, 9);
  
    let sum = 0;
    for (let i = 0; i < 9; i++) {
      sum += parseInt(firstNineDigits[i]) * (10 - i);
    }
    let remainder = 11 - (sum % 11);
    if (remainder === 10 || remainder === 11) {
      remainder = 0;
    }
    if (remainder !== parseInt(cpf[9])) {
      return false;
    }
    sum = 0;
    for (let i = 0; i < 10; i++) {
      sum += parseInt(cpf[i]) * (11 - i);
    }
    remainder = 11 - (sum % 11);
    if (remainder === 10 || remainder === 11) {
      remainder = 0;
    }
    if (remainder !== parseInt(cpf[10])) {
      return false;
    }
  
    return true;
  }
  