export enum FavoriteLangEnum {
  AR = 'AR',
  EN = 'EN'
}

export type User = {
  id: number;
  name: string;
  phone: string;
  email: string;
  favoriteLang: FavoriteLangEnum;
  pushToken: string;
};
