import { Column, Entity, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";

@Entity({name: "notes"})
export class NotesEntity{
    @PrimaryGeneratedColumn({name: 'Id'})
    Id: number

    @Column({name: 'Name'})
    Name: string

    @Column({name: 'Store'})
    Store: string

    @Column({name: 'Message'})
    Message: string

    @Column({name: 'Completed'})
    Completed: number

}