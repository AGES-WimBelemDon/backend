import {ValidatorConstraint,
    ValidatorConstraintInterface
} from 'class-validator';

@ValidatorConstraint({ name: 'customCPFValidator', async: false })
export class CPFValidator implements ValidatorConstraintInterface {
  validate(text: string) {
    return this.isValidCPF(text);
  }
  
  defaultMessage() {
    return "CPF is invalid";
  }
  isValidCPF(cpf: string): boolean {

    const isValid = /^[0-9]{11}$/.test(cpf)
    if(!isValid){
        return false;
    }
    cpf = cpf.replace(/[^\d]+/g, '');
    
    if (cpf.length !== 11) return false;
    
    if (/^(\d)\1+$/.test(cpf)) return false;
    
    let sum = 0;
    for (let i = 0; i < 9; i++) {
        sum += parseInt(cpf.charAt(i)) * (10 - i);
    }
    let remainder = (sum * 10) % 11;
    if (remainder === 10 || remainder === 11) remainder = 0;
    if (remainder !== parseInt(cpf.charAt(9))) return false;
    
    sum = 0;
    for (let i = 0; i < 10; i++) {
        sum += parseInt(cpf.charAt(i)) * (11 - i);
    }
    remainder = (sum * 10) % 11;
    if (remainder === 10 || remainder === 11) remainder = 0;
    if (remainder !== parseInt(cpf.charAt(10))) return false;
    
    return true;
}
}
