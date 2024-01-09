import { Collection, Entity, OneToMany, OneToOne, Property, Unique } from "@mikro-orm/core";
import { CustomBaseEntity } from "./custom-base-entity";
import { User } from "./user";
import { EmployeeLeave } from "./employee-leave";

@Entity({ tableName: 'employees' })
export class Employee extends CustomBaseEntity {
  @OneToOne()
  user!: User;

  @Property({ columnType: "numeric(9,2)" })
  salary!: number;

  @Property()
  dayOffPerMonth!: number;

  @OneToMany('EmployeeLeave', 'employee')
  leaves = new Collection<EmployeeLeave>(this);
}