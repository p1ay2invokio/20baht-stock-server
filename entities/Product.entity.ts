import { Column, Double, Entity, PrimaryColumn } from "typeorm";

@Entity({name: 'product'})
export class ProductEntity{
    @PrimaryColumn({name: 'Barcode'})
    Barcode: string

    @Column({name: 'Name'})
    Name: string

    @Column({name: 'Qty'})
    Qty: number

    @Column({name: 'Image'})
    Image: string

    @Column({name: 'RetailPrice'})
    RetailPrice: number
}