import { IsEnum, IsNotEmpty, IsString, ValidateIf } from 'class-validator';
import { ConfigurationKeyEnum, ConfigurationValueEnum } from './configuration.enum';

export class UpdateConfigurationInput {
  @IsNotEmpty()
  @IsEnum(ConfigurationKeyEnum)
  key: ConfigurationKeyEnum;

  @ValidateIf(obj => !obj.displayedOnBoardAs)
  @IsNotEmpty()
  @IsEnum(ConfigurationValueEnum)
  value?: ConfigurationValueEnum;

  @ValidateIf(obj => !obj.value)
  @IsNotEmpty()
  @IsString()
  displayedOnBoardAs?: string;
}
