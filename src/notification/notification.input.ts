import { IsArray, IsEnum, IsNotEmpty, IsString, MaxLength } from 'class-validator';
import { FavoriteLangEnum } from 'src/user/user.type';

export class NotificationInput {
  @IsNotEmpty()
  @IsArray()
  @IsString({ each: true })
  destinations: string[];

  @IsNotEmpty()
  @IsString()
  @MaxLength(20)
  enSubject: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(20)
  arSubject: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(200)
  enBody: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(200)
  arBody: string;

  @IsNotEmpty()
  @IsEnum(FavoriteLangEnum)
  favoriteLang: FavoriteLangEnum;
}
