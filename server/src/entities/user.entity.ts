import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

import { UserGame } from '@/entities';

import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id?: number;

  @ApiProperty()
  @Column({ name: 'full_name', nullable: false })
  fullName: string;

  @ApiProperty()
  @Column({ nullable: false, unique: true })
  username: string;
  
  @ApiProperty()
  @Column({ select: false, nullable: false })
  password: string;

  @ApiProperty()
  @Exclude()
  @Column({ select: false, nullable: true })
  salt?: string;

  @OneToMany((type) => UserGame, (userGame) => userGame.user)
  userGames?: UserGame[];
}
