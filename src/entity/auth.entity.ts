import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";

@Entity("auth")
export class Auth extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({
    nullable: false,
    length: 100,
    unique: true,
  })
  username: string;

  @Column({
    nullable: false,
    unique: true,
    length: 100,
  })
  email: string;

  @Column({
    nullable: false,
  })
  password: string;

  @Column({
    nullable: false,
    length: 10,
  })
  phone: string;

  @Column({
    enum: ["admin", "user"],
    default: "user",
  })
  role: string;

  @Column({
    nullable: true,
  })
  refreshToken: string;

  @Column({
    nullable: true,
  })
  otp: number;

  @Column({
    nullable: true,
    type: "bigint",
  })
  otpExpiry: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
