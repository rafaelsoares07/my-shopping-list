import app from "../src/app"
import supertest from "supertest"
import {prisma} from "../src/database"
import itemsFactore from "./factore/itemsFactore"
import factoreItem from "./factore/itemsFactore"

beforeEach(async()=>{
  await prisma.$executeRaw`TRUNCATE TABLE items `
})

describe('Testa POST /items ',() => {

  it("Deve retornar 201, se cadastrado um item no formato correto",async()=>{
      const item = itemsFactore()
      const result = await supertest(app).post("/items").send(item)

      expect(result.status).toEqual(201)

  })

  it("Deve retornar 409, se tentar cadastrar pela segunda vez o mesmo item",async()=>{
    const item = itemsFactore()
    await supertest(app).post("/items").send(item)
    const result = await supertest(app).post("/items").send(item)

    expect(result.status).toEqual(409)

  })

});

describe('Testa GET /items ', () => {
  
  it('Deve retornar status 200 e o body no formato de Array',async()=>{
    let type = false
    const item = factoreItem()
    await supertest(app).post('/items').send(item)
    const result = await supertest(app).get("/items")

    console.log(typeof(result.body))
    console.log(result.body[0])

    if(result.body[0]!=null||undefined){
      type = true
    }
    expect(type).toEqual(true)
    expect(result.status).toEqual(200)

  })

});



describe('Testa GET /items/:id ', () => {
  it.todo('Deve retornar status 200 e um objeto igual a o item cadastrado');
  it.todo('Deve retornar status 404 caso não exista um item com esse id');
});
