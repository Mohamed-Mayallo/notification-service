import { datatype, lorem, random } from 'faker';
import { NotificationTypeEnum } from 'src/notification/notification.enum';
import { NotificationInput } from 'src/notification/notification.input';
import { FavoriteLangEnum } from 'src/user/user.type';
import { generateFakePhoneNumber } from 'src/_common/utils/phone.fake';

function generateDestinations(useCase: NotificationTypeEnum, forMulti = false) {
  if (useCase === NotificationTypeEnum.SMS)
    return !forMulti
      ? [generateFakePhoneNumber()]
      : [generateFakePhoneNumber(), generateFakePhoneNumber(), generateFakePhoneNumber()];
  return !forMulti ? [datatype.uuid()] : [datatype.uuid(), datatype.uuid(), datatype.uuid()];
}

export const notificationInputGenerator = (
  useCase: NotificationTypeEnum,
  input: Partial<NotificationInput> = {},
  forMulti = false
) => ({
  destinations: input.destinations || generateDestinations(useCase, forMulti),
  enSubject: input.enSubject || lorem.word(10),
  arSubject: input.arSubject || lorem.word(10),
  enBody: input.enBody || lorem.sentence(5),
  arBody: input.arBody || lorem.sentence(5),
  favoriteLang:
    input.favoriteLang || (random.arrayElement(Object.keys(FavoriteLangEnum)) as FavoriteLangEnum)
});
