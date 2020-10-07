import {
  Controller,
  Get,
  HttpCode,
  Req,
  UploadedFile,
  Param,
  Post,
  Delete,
  Query,
  Body,
  UseGuards,
  ValidationPipe,
  UseInterceptors,
} from '@nestjs/common';
import { HttpStatus } from '../utils/HttpConstant';
import { Request, Response } from 'express';
import { diskStorage } from 'multer';
import { VehiclesService } from './vehicles.service';
import { CreateVehicleDto } from './dto/create-vehicle.dto';
import { FileInterceptor } from '@nestjs/platform-express/multer/interceptors/file.interceptor';
import { Res } from '@nestjs/common/decorators/http/route-params.decorator';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UpdateVehicleDto } from './dto/update-vehicle.dto';

@Controller('vehicles')
export class VehiclesController {
  constructor(private readonly vehiclesService: VehiclesService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  @HttpCode(HttpStatus.OK)
  async all(@Query('page') page: string, @Query('perPage') perPage: string) {
    return this.vehiclesService.all(page, perPage);
  }

  @UseGuards(JwtAuthGuard)
  @Get('one')
  @HttpCode(HttpStatus.OK)
  async one(@Req() request: Request) {
    return await this.vehiclesService.one(request);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          cb(null, file.originalname);
        },
      }),
    }),
  )
  async save(
    @UploadedFile() file,
    @Body(new ValidationPipe()) createDto: CreateVehicleDto,
    @Res() resp: Response,
  ) {
    console.log(file);
    console.log(createDto);
    await this.vehiclesService
      .save(createDto, file)
      .then(res => {
        if (typeof res === 'string') {
          resp.status(HttpStatus.OK).json({
            message: 'Ok',
            code: HttpStatus.OK,
            data: res,
          });
        } else {
          resp.status(HttpStatus.OK).json({
            message: 'CREATED',
            code: HttpStatus.CREATED,
            data: res,
          });
        }
      })
      .catch(error => {
        resp
          .status(HttpStatus.ACCEPTED)
          .json({ message: error, code: HttpStatus.ACCEPTED });
      });
  }

  @UseGuards(JwtAuthGuard)
  @Post('update')
  @HttpCode(HttpStatus.CREATED)
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          cb(null, file.originalname);
        },
      }),
    }),
  )
  async update(
    @UploadedFile() file,
    @Body(new ValidationPipe()) updateDto: UpdateVehicleDto,
    @Res() resp: Response,
  ) {
    console.log(updateDto);
    await this.vehiclesService
      .update(updateDto, file)
      .then(res => {
        if (typeof res === 'string') {
          resp.status(HttpStatus.OK).json({
            message: 'Ok',
            code: HttpStatus.OK,
            data: res,
          });
        } else {
          resp.status(HttpStatus.OK).json({
            message: 'CREATED',
            code: HttpStatus.CREATED,
            data: res,
          });
        }
      })
      .catch(error => {
        resp
          .status(HttpStatus.ACCEPTED)
          .json({ message: error, code: HttpStatus.ACCEPTED });
      });
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  @HttpCode(HttpStatus.ACCEPTED)
  async remove(@Param() params) {
    return await this.vehiclesService.remove(params.id);
  }

  @UseGuards(JwtAuthGuard)
  @Post('/loadVehicles/')
  @HttpCode(HttpStatus.ACCEPTED)
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          cb(null, file.originalname);
        },
      }),
    }),
  )
  async uploadFile(@UploadedFile() file, @Res() resp: Response) {
    await this.vehiclesService
      .uploadFile(file)
      .then(res => {
        resp.status(HttpStatus.OK).json({
          message: 'Ok',
          code: HttpStatus.OK,
          data: res,
        });
      })
      .catch(error => {
        resp
          .status(HttpStatus.ACCEPTED)
          .json({ message: error, code: HttpStatus.ACCEPTED });
      });
  }
}
