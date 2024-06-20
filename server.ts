import fastify, { FastifyRequest, FastifyReply } from 'fastify'
import cors from '@fastify/cors'
import { myDataSource } from './myDataSource'
import dotenv from 'dotenv'
import { ProductEntity } from './entities/Product.entity'
import { EmployeeEntity } from './entities/Employee.entity'
import { NotesEntity } from './entities/Notes.entity'

// import routes


// ENV
const env = dotenv.config().parsed

const app = fastify()

app.register(cors)

app.get("/api/employee", async (req, res) => {
    const employee = await myDataSource.getRepository(EmployeeEntity).find()

    res.send({ message: employee, status: 200 })
})

app.get("/api/employee/:id", async (req: FastifyRequest<{ Params: { id: string } }>, res: FastifyReply) => {
    const { id } = req.params

    const employeeSpecific = await myDataSource.createQueryBuilder().select("employee").from(EmployeeEntity, "employee").where({ Id: id }).getOne()

    if (employeeSpecific) {
        res.send({ message: employeeSpecific, status: 200 })
    } else {
        res.send({ message: "Internal Server", status: 500 })
    }
})

app.post("/api/addEmployee", async (req: FastifyRequest<{ Body: { username: string, password: string } }>, res: FastifyReply) => {

    const { username, password } = req.body

    const inserted = await myDataSource.createQueryBuilder().insert().into(EmployeeEntity).values({ Id: username, Password: password }).execute()

    if (inserted.raw) {
        res.send({ message: "Inserted Successfully", status: 201 })
    } else {
        res.send({ message: "Employee can not inserted", status: 500 })
    }
})

app.put("/api/updateEmployee", async (req: FastifyRequest<{ Body: { oldUsername: string, newUsername: string } }>, res: FastifyReply) => {
    const { oldUsername, newUsername } = req.body

    const updated = await myDataSource.createQueryBuilder().update(EmployeeEntity).set({ Id: newUsername }).where({ Id: oldUsername }).execute()

    if (updated.raw) {
        res.send({ message: 'Updated Successfully', status: 200 })
    } else {
        res.send({ message: 'Employee can not update', status: 500 })
    }

})

app.delete("/api/deleteEmployee", async (req: FastifyRequest<{ Body: { username: string } }>, res: FastifyReply) => {
    const { username } = req.body

    const deleted = await myDataSource.createQueryBuilder().delete().from(EmployeeEntity).where({ Id: username }).execute()

    if (deleted.raw) {
        res.send({ message: 'Deleted Successfully!', status: 200 })
    } else {
        res.send({ message: 'Employee can not deleted', status: 500 })
    }
})

app.post('/api/product', async (req: FastifyRequest<{ Body: { page: number, qty: number, manyToLess: boolean, qtyBelow: number, price: number, sortPrice: boolean } }>, res: FastifyReply) => {

    const { page, qty, manyToLess, qtyBelow, price, sortPrice } = req.body

    // page = หากี่ชิ้น int
    // qty = น้อยกว่ากี่ชิ้น int
    // manyToLess = มากไปน้อยหรือไม่ boolean
    // qtyBelow = หาต่ำสุดที่เท่าไหร่

    // console.log(sortPrice)

    const product = await myDataSource.createQueryBuilder().select("product").from(ProductEntity, "product").where("product.Qty <= :qty and product.Qty >= :qtyBelow and product.RetailPrice >= :price", { qty: qty, qtyBelow: qtyBelow, price: price }).offset(page).limit(10).orderBy(`${sortPrice ? 'product.RetailPrice' : 'product.Qty'}`, sortPrice ? 'DESC' : manyToLess ? "DESC" : "ASC").execute()

    res.send({ product, status: 200 })
})

app.post('/api/searchProduct', async (req: FastifyRequest<{ Body: { productName: string } }>, res: FastifyReply) => {
    const { productName } = req.body

    const searchProduct = await myDataSource.createQueryBuilder().select("product").from(ProductEntity, "product").where("product.Name like :productName and product.Qty < :qty", { productName: `%${productName}%`, qty: 6 }).execute()

    res.send({ searchProduct, status: 200 })

})

app.get("/api/product/:barcode", async (req: FastifyRequest<{ Params: { barcode: string } }>, res: FastifyReply) => {
    const { barcode } = req.params

    const specificProduct = await myDataSource.createQueryBuilder().select("product").from(ProductEntity, "product").where("product.Barcode = :barcode", { barcode: barcode }).execute()

    res.send({ specificProduct, status: 200 })
})

app.get("/api/productOnlyImages", async (req: FastifyRequest, res: FastifyReply) => {
    const productOnlyImage = await myDataSource.createQueryBuilder().select("product").from(ProductEntity, "product").where("product.Image != :type and product.Qty < :qty", { type: '', qty: 6 }).execute()

    res.send(productOnlyImage)
})


app.post("/api/updateProductImage", async (req: FastifyRequest<{ Body: { img: string, barcode: string } }>, res: FastifyReply) => {

    const { img, barcode } = req.body

    console.log(img, barcode)

    const Updated = await myDataSource.createQueryBuilder().update(ProductEntity).set({ Image: img }).where({ Barcode: barcode }).execute()

    if (Updated.raw) {
        res.send({ status: 203 })
    }
})

app.get("/api/:name", async (req: FastifyRequest<{ Params: { name: string } }>, res: FastifyReply) => {
    const { name } = req.params

    const notes = await myDataSource.createQueryBuilder().select("note").from(NotesEntity, "note").where("note.Name = :name", { name: name }).execute()

    // console.log(notes)

    res.send({ notes, status: 200 })
})

app.post("/api/sendNote", async (req: FastifyRequest<{ Body: { store: string, message: string } }>, res: FastifyReply) => {
    const { store, message } = req.body

    const inserted = await myDataSource.createQueryBuilder().insert().into(NotesEntity).values({ Name: store, Store: store == 'sanpatong' ? 'สันป่าตองแฟร์' : store == 'maekan' ? 'แม่ขานแฟร์' : '', Message: message, Completed: 0 }).execute()

    if (inserted.raw) {
        res.send({ status: 203 })
    }
})


app.patch("/api/checkNote", async (req: FastifyRequest<{ Body: { id: number } }>, res: FastifyReply) => {
    const { id } = req.body

    const data: any = await myDataSource.createQueryBuilder().select("note").from(NotesEntity, "note").where("note.Id = :Id", { Id: id }).getOne()

    console.log(data)

    const updated = await myDataSource.createQueryBuilder().update(NotesEntity).set({ Completed: data.Completed ? 0 : 1 }).where({ Id: id }).execute()

    if (updated.raw) {
        res.send({ status: 204 })
    }
})

app.delete("/api/deleteNote/:note_id", async(req: FastifyRequest<{Params: {note_id: number}}>, res: FastifyReply)=>{

    const {note_id} = req.params

    const deleted = await myDataSource.createQueryBuilder().delete().from(NotesEntity).where({Id: note_id}).execute()

    if(deleted.raw){
        res.send({message: "Deleted Successfully!" ,status: 200})
    }
})

app.listen({ port: 3001, host: '0.0.0.0' }, () => {
    console.log(`Server is running on port ${env?.PORT}`)
})