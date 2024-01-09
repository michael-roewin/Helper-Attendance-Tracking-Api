import { PrimaryKey, Property } from '@mikro-orm/core';

export abstract class CustomBaseEntity {
  @PrimaryKey()
  id!: number;

  @Property({ onCreate: () => new Date()})
  createdAt = new Date();

  @Property({ onUpdate: () => new Date() })
  updatedAt = new Date();
}