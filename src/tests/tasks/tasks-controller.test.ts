Error.stackTraceLimit = 1;

import request from 'supertest'

import { app } from '@/app'
import { prisma } from '@/lib/prisma'
import { hash } from 'bcrypt';
import { sign } from 'jsonwebtoken';
import { env } from '@/env';

const JWT_SECRET = env.JWT_SECRET

describe("TaskController", () => {
    let taskId: string
    let userId: string
    let teamId: string
    let setupUserId: string
    let userToken: string
    let userTwoId: string
    let userTwoToken: string
    let teamTwoId: string

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
        if(taskId) await prisma.tasks.delete({ where: { id: taskId } })
        if(userId) await prisma.user.delete({ where: { id: userId } })
        if(setupUserId) await prisma.user.delete({ where: { id: setupUserId } })
        if(teamId) await prisma.teams.delete({ where: { id: teamId } })
        if(teamTwoId) await prisma.teams.delete({ where: { id: teamTwoId } })

        await prisma.$disconnect()
    })

    it("deve criar uma tarefa", async () => {
        const teamResponse = await prisma.teams.create({
            data: {
                name: "Equipe front end"
            }
        })

        const user = await prisma.user.create({
            data: {
                name: "Test User",
                email: "testuserrrrr@email.com",
                password: "hashedPassword"
            }
        })

        userId = user.id

        const taskResponse = await request(app).post("/tasks/create-task").set("Authorization", `Bearer ${userToken}`).send({
            title: "Desenvolvimento web",
            description: "Desenvolver home page da google em uma semana",
            status: "pending",
            priority: "high",
            assignedTo: userId,
            teamId: teamResponse.id
        })

        teamId = teamResponse.id
        taskId = taskResponse.body.id

        expect(taskResponse.status).toBe(201)
        expect(taskResponse.body.title).toBe("Desenvolvimento web")
        expect(taskResponse.body).toHaveProperty("id")
    })

    it("deve gerar uma exceção", async () => {
        const user = await prisma.user.create({
            data: {
                name: "Test User Two",
                email: "testusertwo@email.com",
                password: "123456"
            }
        })

        userTwoId = user.id

        userTwoToken = sign({ role: "member" }, JWT_SECRET, {
            subject: userTwoId,
            expiresIn: "1d"          
        })

        const teamResponse = await prisma.teams.create({
            data: {
                name: "Equipe front end"
            }
        })

        teamTwoId = teamResponse.id

        const response = await request(app).post("/tasks/create-task").set("Authorization", `Bearer ${userTwoToken}`).send({
            title: "Desenvolvimento web",
            description: "Desenvolver home page da google em uma semana",
            status: "pending",
            priority: "high",
            assignedTo: userTwoId,
            teamId: teamResponse.id
        })

        expect(response.status).toBe(401)
        expect(response.body.message).toBe("Não autorizado.")
    })
})