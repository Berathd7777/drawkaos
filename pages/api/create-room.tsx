import { PrismaClient } from '@prisma/client'
import type { NextApiRequest, NextApiResponse } from 'next'

const prisma = new PrismaClient()

type FormData = {
  roomName: string
  userName: string
}

export type CreatedRoom = {
  redirectTo: string
}

type ApiError = {
  message: string
}

export default async (
  req: NextApiRequest,
  res: NextApiResponse<CreatedRoom | ApiError>
) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  const { roomName, userName }: FormData = JSON.parse(req.body)

  const { id, adminId } = await prisma.room.create({
    data: {
      name: roomName,
      createdAt: new Date(),
      admin: {
        create: {
          name: userName,
          createdAt: new Date(),
        },
      },
    },
  })

  res.status(200).json({
    redirectTo: `${id}/${adminId}`,
  })
}
