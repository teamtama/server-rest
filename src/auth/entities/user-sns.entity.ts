import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class UserSns {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty()
  @Column({ nullable: true })
  kakao: string;

  @ApiProperty()
  @Column({ nullable: true })
  line: string;

  @ApiProperty()
  @Column({ nullable: true })
  instagram: string;

  @ApiProperty()
  @Column({ nullable: true })
  facebook: string;

  @ApiProperty()
  @Column({ nullable: true })
  twitter: string;
}
