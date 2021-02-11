import { Column, Entity, OneToMany, ManyToOne, JoinColumn, PrimaryGeneratedColumn } from 'typeorm';

import { UserGame } from '@/entities';

import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { Status } from './status.entity';

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

    @Column({ name: 'fk_status', type: 'int', default: 4 })
    @ManyToOne((type) => Status, (status) => status.users)
    @JoinColumn({ name: 'fk_status' })
    status: Status;

    @OneToMany((type) => UserGame, (userGame) => userGame.user)
    userGames?: UserGame[];
}
