import { internet, lorem, name, phone, random } from 'faker';
import { FavoriteLangEnum, User } from './user.type';

export let users = [];

for (let i = 0; i < 1000; i++) {
  const user: User = {
    id: i + 1,
    name: name.firstName(),
    email: internet.email(),
    phone: phone.phoneNumber(`+20${random.arrayElement([11, 12, 10])}########`),
    favoriteLang: random.arrayElement(Object.keys(FavoriteLangEnum)) as FavoriteLangEnum,
    pushToken: lorem.sentence()
  };

  users.push(user);
}
