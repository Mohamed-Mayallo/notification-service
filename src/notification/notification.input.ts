import { FavoriteLangEnum } from 'src/user/user.type';

export interface NotificationInput {
  destinations: string[];
  enSubject: string;
  arSubject: string;
  enBody: string;
  arBody: string;
  favoriteLang: FavoriteLangEnum;
}
