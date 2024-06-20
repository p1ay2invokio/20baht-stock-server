import {DataSource} from 'typeorm'

export const myDataSource = new DataSource({
    username: 'root',
    password: '',
    database: 'onepointofsale',
    type: 'mysql',
    port: 3306,
    synchronize: false,
    logging: false,
    entities: ['./entities/*.entity.ts']
})

myDataSource.initialize().then((res) => {
    console.log("Initialized Database")
}).catch((err) => {
    console.log(err)
})