import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('jars')
export class Jar {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  jarUrl!: string;

  @Column()
  authorNickname!: string;

  @Column({ nullable: true })
  jarId?: string;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @Column({ nullable: true, type: 'text' })
  accumulated?: string | null;

  @Column({ nullable: true, type: 'text' })
  goal?: string | null;

  @Column({ nullable: true, type: 'timestamptz' })
  lastStatsUpdate?: Date | null;
}
