import { Entity, Property, Unique } from "@mikro-orm/core";
import { CustomBaseEntity } from "./custom-base-entity";

/* export enum UserType {
  ADMIN = 'admin',
  EMPLOYEE = 'employee',
}
 */
@Entity({ tableName: 'users' })
export class User extends CustomBaseEntity {
  @Property()
  firstName!: string;

  @Property()
  lastName!: string;

  @Property()
  @Unique()
  username!: string;

  @Property()
  password!: string;

  @Property()
  isEmployee!: boolean;

  @Property()
  active!: boolean;
}