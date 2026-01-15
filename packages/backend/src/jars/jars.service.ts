import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Jar } from './jar.entity';

@Injectable()
export class JarsService {
  constructor(
    @InjectRepository(Jar)
    private jarsRepository: Repository<Jar>,
  ) {}

  async create(jarUrl: string, authorNickname: string): Promise<Jar> {
    const jar = this.jarsRepository.create({
      jarUrl,
      authorNickname,
    });
    return this.jarsRepository.save(jar);
  }

  async findAll(): Promise<Jar[]> {
    return this.jarsRepository.find({
      order: {
        createdAt: 'DESC',
      },
    });
  }

  async findOne(id: string): Promise<Jar | null> {
    return this.jarsRepository.findOne({
      where: { id },
    });
  }

  async update(id: string, jarUrl: string, authorNickname: string): Promise<Jar | null> {
    await this.jarsRepository.update(id, { jarUrl, authorNickname });
    return this.findOne(id);
  }

  async delete(id: string): Promise<void> {
    await this.jarsRepository.delete(id);
  }
}
