import { Column, Entity, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";

@Entity({name: 'employee'})
export class EmployeeEntity{
    @PrimaryColumn({name: 'Id'})
    Id: string

    @Column({name: 'Password'})
    Password: string
}