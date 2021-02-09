import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

import { User, Game } from '@/entities';

import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class UserGame {
  @PrimaryGeneratedColumn()
  id?: number;

  @ApiProperty()
  @Column({ name: 'total_points', nullable: true })
  totalPoints?: string;

  @ApiProperty()
  @Column({ name: 'is_host', nullable: false })
  isHost: boolean;
  
  @ApiProperty()
  @Column({ nullable: false })
  password: string;

  @ManyToOne((type) => User, (user) => user.userGames)
  @JoinColumn({ name: 'fk_user' })
  user: User;

  @ManyToOne((type) => Game, (game) => game.userGames)
  @JoinColumn({ name: 'fk_game' })
  game: Game;
}
