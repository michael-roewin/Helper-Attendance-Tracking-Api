import type { EntityManager } from '@mikro-orm/core';
import { Seeder } from '@mikro-orm/seeder';
import { User } from '../src/entities/user';

export class DatabaseSeeder extends Seeder {

  async run(em: EntityManager): Promise<void> {
    const user = em.create(User, {
      firstName: 'Admin',
      lastName: 'Admin',
      username: 'admin',
      password: '$2b$10$OeD3YyNDHIzHPCkaUyZXWOAFMRAk9o4X2dVvIe0LdwWlQWzg1IU7K', // test1234
      isEmployee: false,
      active: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

}
