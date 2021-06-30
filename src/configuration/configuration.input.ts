import { IsEnum, IsNotEmpty, IsString, ValidateIf } from 'class-validator';
import { ConfigurationKeyEnum } from './configuration.enum';

export class UpdateConfigurationInput {
  @IsNotEmpty()
  @IsEnum(ConfigurationKeyEnum)
  key: ConfigurationKeyEnum;

  @ValidateIf(obj => !obj.displayedOnBoardAs)
  @IsNotEmpty()
  @IsString()
  value?: string;

  @ValidateIf(obj => !obj.value)
  @IsNotEmpty()
  @IsString()
  displayedOnBoardAs?: string;
}
