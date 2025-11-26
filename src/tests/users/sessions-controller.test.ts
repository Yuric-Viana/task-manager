Error.stackTraceLimit = 1;

import request from 'supertest'

import { app } from '@/app'
import { prisma } from '@/lib/prisma'

describe("SessionsController", () => {
    let userId: string
    let userTwoId: string
    let userThreeId: string

    afterAll(async () => {
        await prisma.user.delete({ where: { id: userId } })
        await prisma.user.delete({ where: { id: userTwoId } })
        await prisma.user.delete({ where: { id: userThreeId } })

        await prisma.$disconnect()
    })

    it("deve autenticar e obter o token de acesso", async () => {
        const userResponse = await request(app).post("/users").send({
            name: "Test User",
            email:"test@email.com",
            password: "test123"
        })

        userId = userResponse.body.id

        const sessionsResponse = await request(app).post("/sessions").send({
            email: "test@email.com",
            password: "test123"
        })

        expect(sessionsResponse.body.token).toEqual(expect.any(String))
        expect(sessionsResponse.status).toBe(200)
    })

    it("deve lançar uma exceção de email ou senha incorretos", async () => {
        const userResponse = await request(app).post("/users").send({
            name: "Test User",
            email:"test_user@email.com",
            password: "test123"
        })

        userTwoId = userResponse.body.id

        const sessionsResponse = await request(app).post("/sessions").send({
            email: "testuser@email.com",
            password: "test123"
        })

        expect(sessionsResponse.status).toBe(401)
        expect(sessionsResponse.body.message).toBe("Invalid email or password")
    })

    it("deve lançar uma exceção de email ou senha incorretos", async () => {
        const userResponse = await request(app).post("/users").send({
            name: "Test User",
            email:"testtwo@email.com",
            password: "test123test"
        })

        userThreeId = userResponse.body.id

        const sessionsResponse = await request(app).post("/sessions").send({
            email: "testusertwo@email.com",
            password: "test123"
        })

        expect(sessionsResponse.status).toBe(401)
        expect(sessionsResponse.body.message).toBe("Invalid email or password")
    })
})