Error.stackTraceLimit = 1;

import request from "supertest"

import { app } from "@/app"
import { prisma } from "@/lib/prisma"
import { env } from "@/env"
import { sign } from "jsonwebtoken"
import { hash } from "bcrypt"

const JWT_SECRET = env.JWT_SECRET

describe("UserController", () => {
    let userId: string
    let setupUserId: string
    let userToken: string

    beforeAll(async () => {
        const password = '123456'
        const hashedPassword = await hash(password, 10)

        const user = await prisma.user.create({
            data: {
                name: "Test User",
                email: "testuser@email.com",
                password: hashedPassword
            }
        })

        setupUserId = user.id

        userToken = sign({ role: 'admin' }, JWT_SECRET, {
            subject: setupUserId,
            expiresIn: '1d'
        });
    })

    afterAll(async () => {
        await prisma.user.delete({ where: { id: setupUserId } })
        await prisma.user.delete({ where: { id: userId } })

        await prisma.$disconnect();
    })

    it("deve criar um novo usuário", async () => {
        const response = await request(app).post("/users").send({
            name: "User Test",
            email: "test@email.com",
            password: "123456"
        })

        expect(response.status).toBe(201)
        expect(response.body).toHaveProperty("id")
        expect(response.body.name).toBe("User Test")

        userId = response.body.id
    })

    it("deve listar todos os usuários", async () => {
        const response = await request(app).get("/users").set("Authorization", `Bearer ${userToken}`)

        expect(response.status).toBe(200); 
        expect(response.body).toBeInstanceOf(Array); 
    })

    it("deve gerar um erro de email usuário já cadastrado", async () => {
        const response = await request(app).post("/users").send({
            name: "User Test",
            email: "test@email.com",
            password: "123456"
        })

        expect(response.status).toBe(409)
        expect(response.body.message).toBe("User with this email already exists")
    })
})