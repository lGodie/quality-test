import { Validator, IsNotEmpty, IsDate } from 'class-validator';
// import { ApiModelProperty } from '@nestjs/swagger';

export class UpdateVehicleDto {
  @IsNotEmpty({
    message: 'Required field',
  })
  readonly plaque: string;

  @IsNotEmpty()
  readonly id: number;

  @IsNotEmpty()
  readonly colour: string;

  @IsNotEmpty()
  readonly model: number;
}
