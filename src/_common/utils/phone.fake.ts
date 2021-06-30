import { phone, random } from 'faker';

export function generateFakePhoneNumber() {
  return phone.phoneNumber(`+20${random.arrayElement([11, 12, 10])}########`);
}
