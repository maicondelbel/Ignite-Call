/* eslint-disable camelcase */
import dayjs from 'dayjs'
import { NextApiRequest, NextApiResponse } from 'next'
import { z } from 'zod'
import { prisma } from '../../../../lib/prisma'
import { google } from 'googleapis'
import { getGoogleAuthToken } from '../../../../lib/google'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== 'POST') {
    return res.status(405).end()
  }

  const createScheduleSchema = z.object({
    name: z.string(),
    email: z.string().email(),
    notes: z.string(),
    date: z
      .string()
      .datetime()
      .transform((value) => dayjs(value).startOf('hour')),
  })

  const username = String(req.query.username)
  const { name, email, notes, date } = createScheduleSchema.parse(req.body)

  if (date.isBefore(new Date())) {
    return res.status(400).json({ message: 'Date is in the past' })
  }

  const user = await prisma.user.findUnique({
    where: {
      username,
    },
  })

  if (!user) {
    return res.status(400).json({ message: 'User does not exists.' })
  }

  const conflictSchedule = await prisma.scheduling.findFirst({
    where: {
      user_id: user.id,
      date: date.toDate(),
    },
  })

  if (conflictSchedule) {
    return res
      .status(400)
      .json({ message: 'There is another schedule at the same time.' })
  }

  const schedule = await prisma.scheduling.create({
    data: {
      name,
      email,
      notes,
      date: date.toDate(),
      user_id: user.id,
    },
  })

  const calendar = google.calendar({
    version: 'v3',
    auth: await getGoogleAuthToken(user.id),
  })

  await calendar.events.insert({
    conferenceDataVersion: 1,
    calendarId: 'primary',
    requestBody: {
      summary: `Ignite Call: ${name}`,
      description: notes,
      start: {
        dateTime: date.format(),
      },
      end: {
        dateTime: date.add(1, 'hour').format(),
      },
      attendees: [{ email, displayName: name }],
      conferenceData: {
        createRequest: {
          requestId: schedule.id,
          conferenceSolutionKey: {
            type: 'hangoutsMeet',
          },
        },
      },
    },
  })

  return res.status(201).end()
}
