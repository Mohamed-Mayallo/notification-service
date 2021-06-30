import { internet, lorem, name, random } from 'faker';
import { generateFakePhoneNumber } from 'src/_common/utils/phone.fake';
import { FavoriteLangEnum, User } from './user.type';

export let users = [];

for (let i = 0; i < 1000; i++) {
  const user: User = {
    id: i + 1,
    name: name.firstName(),
    email: internet.email(),
    phone: generateFakePhoneNumber(),
    favoriteLang: random.arrayElement(Object.keys(FavoriteLangEnum)) as FavoriteLangEnum,
    pushToken: lorem.sentence()
  };

  users.push(user);
}
