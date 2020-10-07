import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'vehicles' })
export class Vehicle {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  plaque: string;

  @Column('int', {
    nullable: false,
    name: 'model',
    unsigned: true,
  })
  model: number;

  @Column('varchar', {
    nullable: false,
    length: 64,
    name: 'colour',
  })
  colour: string;

  @Column()
  active: number;

  @Column()
  insertDate: Date;

  @Column('datetime', {
    nullable: true,
    name: 'updateDate',
  })
  updateDate: Date;

  @Column('decimal', {
    nullable: false,
    name: 'price',
    precision: 9,
    scale: 2,
    unsigned: true,
  })
  price: number;

  @Column('varchar', {
    nullable: false,
    unique: true,
    length: 250,
    name: 'picturePath',
  })
  picturePath: string;
}
