import { Injectable } from '@nestjs/common';
import { getRepository } from 'typeorm';
import { Vehicle } from './vehicles.entity';
import * as xlsx from 'xlsx';
import { CreateVehicleDto } from './dto/create-vehicle.dto';
import path from 'path';
import { UpdateVehicleDto } from './dto/update-vehicle.dto';

@Injectable()
export class VehiclesService {
  async all(page, perPage) {
    const repository = getRepository(Vehicle);
    page = parseInt(page);
    perPage = parseInt(perPage);

    const qb = repository.createQueryBuilder();

    if (!Number.isNaN(page) && !Number.isNaN(perPage)) {
      qb.skip(perPage * page).take(perPage);
    } else {
      return [[], 0];
    }

    return await qb.getManyAndCount();
  }

  async one(request) {
    let plaque: any = request.query.plaque;
    const repository = getRepository(Vehicle);
    return await repository.findOne({ plaque: plaque });
  }

  async save(vehicleDto: CreateVehicleDto, file: any) {
    const repository = getRepository(Vehicle);
    let plaque = vehicleDto.plaque;
    const arrayPath = file.path.split('\\');
    const pathString: string = arrayPath.slice(1, arrayPath.length).join('\\');

    if (plaque.length > 10)
      return `La placa ${plaque} debe contener máximo 10 caracteres`;
    let existVehicle = await repository.findOne({ plaque });
    if (!existVehicle) {
      let price = 200.0;
      console.log(price);
      const vehicle = new Vehicle();
      vehicle.plaque = vehicleDto.plaque;
      vehicle.model = vehicleDto.model;
      vehicle.insertDate = new Date();
      vehicle.picturePath = pathString;
      vehicle.active = 1;
      vehicle.price =
        this.calculatePrice(new Date(), price, vehicle.model) || price;
      vehicle.colour = vehicleDto.colour;
      return await repository.save(vehicle);
    } else {
      return `El vehiculo con placa ${plaque} ya existe`;
    }
  }

  async update(vehicleDto: UpdateVehicleDto, file: any) {
    const repository = getRepository(Vehicle);
    let id = vehicleDto.id;
    const arrayPath = file.path.split('\\');
    const pathString: string = arrayPath.slice(1, arrayPath.length).join('\\');

    let existVehicle = await repository.findOne({ id });
    if (existVehicle) {
      let price = 200.0;
      const updateVehicle = new Vehicle();
      updateVehicle.plaque = vehicleDto.plaque || existVehicle.plaque;
      updateVehicle.model = vehicleDto.model || existVehicle.model;
      updateVehicle.insertDate = new Date();
      updateVehicle.picturePath = pathString;
      updateVehicle.active = 1;
      updateVehicle.price =
        this.calculatePrice(new Date(), price, vehicleDto.model) || price;
      updateVehicle.colour = vehicleDto.colour || existVehicle.colour;
      console.log(updateVehicle);
      return await repository.update(vehicleDto.id, updateVehicle);
    } else {
      return `El vehiculo no existe`;
    }
  }

  async remove(id) {
    const repository = getRepository(Vehicle);
    let entityToRemove = await repository.findOne(id);
    return await repository.remove(entityToRemove);
  }

  async uploadFile(file) {
    const workbook = await xlsx.readFile(`${file.path}`);
    const ws = workbook.Sheets['Vehicles'];
    const dataToJson = xlsx.utils.sheet_to_json(ws);
    try {
      this.runExcelData(dataToJson);
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async runExcelData(dataToJson: any[]) {
    const batchSize = 400;
    let batchNum = 0;

    while (dataToJson.length !== 0) {
      const batch = dataToJson.splice(0, batchSize);
      for (let i = 0; i < batch.length; i++) {
        const row: any = batch[i];
        const plaque = row.Plaque;
        await this.processData(plaque, row, batchNum * batchSize + i);
      }
      batchNum++;
    }
  }

  async processData(plaque: any, row: any, i: any) {
    let price = 200.0;
    const repository = getRepository(Vehicle);
    try {
      let vehicle = await repository.findOne({ plaque });
      if (!vehicle) {
        vehicle = new Vehicle();
        vehicle.plaque = plaque !== '' ? plaque : null;
        vehicle.colour = row.Colour !== '' ? row.Colour : null;
        vehicle.model = row.Model !== '' ? row.Model : null;
        vehicle.price =
          this.calculatePrice(new Date(), price, vehicle.model) || price;
        vehicle.insertDate = new Date();
        vehicle.active = 1;
        await repository.save(vehicle);
      } else {
        vehicle.price =
          this.calculatePrice(new Date(), price, vehicle.model) || price;
        await repository
          .createQueryBuilder()
          .update(Vehicle)
          .set({
            price: vehicle.price,
            plaque: plaque !== '' ? plaque : null,
            colour: row.Colour !== '' ? row.Colour : null,
            model: row.Model !== '' ? row.Model : null,
            updateDate: new Date(),
          })
          .where('id = :id', { id: vehicle.id })
          .execute();
      }
    } catch (error) {
      console.error(error.message);
    }
  }

  EvenDate(date: Date) {
    let Result: boolean;
    let numero: number = date.getDay();
    Result = numero % 2 == 0 ? true : false;
    return Result;
  }

  calculatePrice(date: Date, price, model) {
    let resultPrice;
    let resultDay = this.EvenDate(new Date());
    if (resultDay == true) {
      resultPrice = this.calculateIsEven(price);
    }
    if (parseInt(model) <= 1997) {
      resultPrice = this.calculatePriceOldVehicle(price);
    }
    return resultPrice;
  }

  calculateIsEven(price) {
    let commission = price * 0.05;
    let result = price + commission;
    return result;
  }

  calculatePriceOldVehicle(price) {
    let commission20 = price * 0.2;
    let result = price + commission20;
    return result;
  }
}
