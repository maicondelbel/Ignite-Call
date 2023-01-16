/* eslint-disable camelcase */
import dayjs from 'dayjs'
import { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '../../../../lib/prisma'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== 'GET') {
    return res.status(405).end()
  }

  const username = String(req.query.username)
  const { date } = req.query

  if (!date) {
    return res.status(400).json({ message: 'Date not provided.' })
  }

  const user = await prisma.user.findUnique({
    where: {
      username,
    },
  })

  if (!user) {
    return res.status(400).json({ message: 'User does not exists.' })
  }

  const referenceDate = dayjs(String(date))
  const isPastDate = referenceDate.endOf('day').isBefore(new Date())
  if (isPastDate) {
    return res.json({
      possibleTimesToSchedule: [],
      unavailableTimesToSchedule: [],
    })
  }
  const userAvailability = await prisma.userTimeInterval.findFirst({
    where: {
      user_id: user.id,
      week_day: referenceDate.get('day'),
    },
  })
  if (!userAvailability) {
    return res.json({
      possibleTimesToSchedule: [],
      unavailableTimesToSchedule: [],
    })
  }

  const { time_start_in_minutes, time_end_in_minutes } = userAvailability

  const timeStartInHour = time_start_in_minutes / 60
  const timeEndInHour = time_end_in_minutes / 60

  const possibleTimesToSchedule = Array.from({
    length: timeEndInHour - timeStartInHour,
  }).map((_, i) => {
    return timeStartInHour + i
  })

  const timesAlreadyScheduled = await prisma.scheduling.findMany({
    select: {
      date: true,
    },
    where: {
      user_id: user.id,
      date: {
        gte: referenceDate.startOf('day').toDate(),
        lte: referenceDate.endOf('day').toDate(),
      },
    },
  })

  const unavailableTimesToSchedule = timesAlreadyScheduled.map((schedules) => {
    return schedules.date
  })

  return res.json({ possibleTimesToSchedule, unavailableTimesToSchedule })
}
