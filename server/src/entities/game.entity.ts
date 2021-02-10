import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

import { UserGame, Status } from '@/entities';

import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class Game {
    @PrimaryGeneratedColumn()
    id?: number;

    @ApiProperty()
    @CreateDateColumn({ name: 'start_date', nullable: false })
    startDate: Date;

    @ApiProperty()
    @Column({ name: 'end_date', nullable: true })
    endDate?: Date;

    @ApiProperty()
    @Column({ name: 'access_password', nullable: true })
    accessPassword?: string;

    @OneToMany((type) => UserGame, (userGame) => userGame.game, { cascade: true })
    userGames?: UserGame[];

    @ManyToOne((type) => Status, (status) => status.games)
    @JoinColumn({ name: 'fk_status' })
    status: Status;
}
