import { Cascade, Collection, Entity, Enum, ManyToOne, OneToMany, Property } from "@mikro-orm/core";
import { CustomBaseEntity } from "./custom-base-entity";
import { Employee } from "./employee";
import { EmployeeLeaveItem } from "./employee-leave-item";

export enum LeaveType {
  ABSENT = 'absent',
  DAYOFF = 'dayoff',
  VACATION = 'vacation',
}

@Entity({ tableName: 'employee_leaves' })
export class EmployeeLeave extends CustomBaseEntity {
  @ManyToOne()
  employee!: Employee;

  @Property({ type: "date" })
  startDate!: Date;

  @Property({ type: "date" })
  endDate!: Date;

  @Enum(() => LeaveType)
  type!: LeaveType;

  @Property({ type: 'text'})
  reason!: string;

  @Property({ columnType: "numeric(9,2)" })
  numDays!: string;

  @OneToMany('EmployeeLeaveItem', 'leave',{ orphanRemoval: true, cascade: [Cascade.ALL] })
  items = new Collection<EmployeeLeaveItem>(this);
}