import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

import { Game } from '@/entities';

import { ApiProperty } from '@nestjs/swagger';
import { User } from './user.entity';

@Entity()
export class Status {
    @PrimaryGeneratedColumn()
    id?: number;

    @ApiProperty()
    @Column({ nullable: false })
    name: string;

    @ApiProperty()
    @Column({ nullable: false })
    description: string;

    @OneToMany((type) => Game, (game) => game.status)
    games?: Game[];

    @OneToMany((type) => User, (user) => user.status)
    users?: User[];
}
