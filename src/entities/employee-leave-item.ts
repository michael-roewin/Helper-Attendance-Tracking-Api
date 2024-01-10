import { Entity, Enum, ManyToOne, Property } from "@mikro-orm/core";
import { CustomBaseEntity } from "./custom-base-entity";
import { EmployeeLeave } from "./employee-leave";

export enum LeaveItemType {
  WHOLE_DAY = 'whole-day',
  HALF_DAY = 'half-day',
}

export enum HalfDayType {
  FIRST_HALF = 'first-half',
  SECOND_HALF = 'second-half',
}

@Entity({ tableName: 'employee_leave_items' })
export class EmployeeLeaveItem extends CustomBaseEntity {
  @ManyToOne()
  leave!: EmployeeLeave;

  @Property({ type: "date" })
  date!: Date;

  @Enum(() => LeaveItemType)
  type!: LeaveItemType;

  @Enum({ items: () => HalfDayType, nullable: true })
  halfDayType!: HalfDayType;
}