import { Entity, Enum, ManyToOne, OneToOne, Property, Unique } from "@mikro-orm/core";
import { CustomBaseEntity } from "./custom-base-entity";
import { Employee } from "./employee";

export enum LeaveType {
  ABSENT = 'absent',
  DAYOFF = 'dayoff',
}

@Entity({ tableName: 'employee_leaves' })
export class EmployeeLeave extends CustomBaseEntity {
  @ManyToOne()
  employee!: Employee;

  @Property({ type: "date" })
  startDate!: Date;

  @Property({ type: "date" })
  endDate!: Date;

  @Property()
  numDays!: number;

  @Enum(() => LeaveType)
  type!: LeaveType;
}