import { Validator, IsNotEmpty, IsDate } from 'class-validator';
// import { ApiModelProperty } from '@nestjs/swagger';

export class CreateVehicleDto {
  @IsNotEmpty({
    message: 'Required field',
  })
  readonly plaque: string;

  // @IsNotEmpty()
  // readonly picturePath: string;

  @IsNotEmpty()
  readonly colour: string;

  @IsNotEmpty()
  readonly model: number;
}
