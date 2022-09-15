import app from "../src/app"
import supertest from "supertest"
import {prisma} from "../src/database"
import itemsFactore from "./factore/itemsFactore"
import factoreItem from "./factore/itemsFactore"
import { object } from "joi"

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

    if(result.body[0]!=null||undefined){
      type = true
    }
    expect(type).toEqual(true)
    expect(result.status).toEqual(200)

  })

});



describe('Testa GET /items/:id ', () => {

  it('Deve retornar status 200 e um objeto igual a o item cadastrado',async()=>{

    let object =false
    const item = factoreItem()
    const ItemCadastrado = await supertest(app).post('/items').send(item)

    const resul = await supertest(app).get(`/items/${ItemCadastrado.body.id}`)

    console.log(ItemCadastrado.body)
    console.log(resul.body)
    
    if(JSON.stringify(ItemCadastrado.body)===JSON.stringify(resul.body)){
      object = true
    }


    expect(object).toEqual(true)
    expect(resul.status).toEqual(200)
  })


  it('Deve retornar status 404 caso não exista um item com esse id',async()=>{

    const resul = await supertest(app).get("/items/15875888484")

    expect(resul.status).toEqual(404)
  });

});
