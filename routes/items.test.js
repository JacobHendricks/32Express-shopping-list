process.env.NODE_ENV = "test";

const request = require("supertest");

const app = require("../app");
let items = require("../fakeDb");

let milk = {'name': "milk", "price": 2.80}

beforeEach(function() {
  items.push(milk);
});

afterEach(function() {
  // make sure this *mutates*, not redefines, `items`
  items.length = 0;
});

describe("GET /items", function() {
  test("Gets a list of items", async function() {
    const resp = await request(app).get(`/items`);
    expect(resp.statusCode).toBe(200);
    expect(resp.body).toEqual({items: [milk]});
  });
});

describe("GET /items/:name", () => {
  test("Get item by name", async () => {
    const res = await request(app).get(`/items/${milk.name}`);
    expect(res.statusCode).toBe(200)
    expect(res.body).toEqual({"item": { 'name': "milk", "price": 2.80 }})
  })
  test("Responds with 404 for invalid item", async () => {
    const res = await request(app).get(`/items/icecube`);
    expect(res.statusCode).toBe(404)
  })
})


describe("POST /items", function() {
  test("Adding item", async function() {
    const res = await request(app).post("/items").send({'name': "bread", "price": 3.29});
    expect(res.statusCode).toBe(201);
    expect(res.body).toEqual({"item": {'name': "bread", "price": 3.29}})
  })
  test("Responds with 400 if name is missing", async () => {
    const res = await request(app).post("/items").send({});
    expect(res.statusCode).toBe(400);
  })
});


describe("/PATCH /items/:name", () => {
  test("Updating an item's name", async () => {
    const res = await request(app).patch(`/items/${milk.name}`).send({ price: 3.19 });
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({ item: { "price": 3.19 } });
  })
  test("Responds with 404 for invalid name", async () => {
    const res = await request(app).patch(`/items/Piggles`).send({ name: "milk" });
    expect(res.statusCode).toBe(404);
  })
})

describe("/DELETE /items/:name", () => {
  test("Deleting an item", async () => {
    const res = await request(app).delete(`/items/${milk.name}`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({ message: 'Deleted' })
  })
  test("Responds with 404 for deleting invalid item", async () => {
    const res = await request(app).delete(`/items/hamface`);
    expect(res.statusCode).toBe(404);
  })
})

// describe("DELETE /items/:name", function () {
//   test("Deletes a single a item", async function () {
//     const response = await request(app)
//       .delete(`/items/${milk.name}`);
//     expect(response.statusCode).toBe(200);
//     expect(response.body).toEqual({ message: "Deleted" });
//   });
// });