/* eslint-disable camelcase */
import { NextApiRequest, NextApiResponse } from 'next'
import { unstable_getServerSession } from 'next-auth'
import { z } from 'zod'
import { buildNextAuthOptions } from '../auth/[...nextauth].api'
import { prisma } from './../../../lib/prisma'

const timeIntervalsFormSchema = z.object({
  intervals: z.array(
    z.object({
      weekday: z.number(),
      startTimeInMinutes: z.number(),
      endTimeInMinutes: z.number(),
    }),
  ),
})

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== 'POST') {
    return res.status(405).end()
  }

  const session = await unstable_getServerSession(
    req,
    res,
    buildNextAuthOptions(req, res),
  )

  if (!session) {
    return res.status(401).end()
  }

  const { intervals } = timeIntervalsFormSchema.parse(req.body)

  await Promise.all(
    intervals.map((interval) => {
      return prisma.userTimeInterval.create({
        data: {
          week_day: interval.weekday,
          time_end_in_minutes: interval.endTimeInMinutes,
          time_start_in_minutes: interval.startTimeInMinutes,
          user_id: session.user.id,
        },
      })
    }),
  )

  return res.status(201).end()
}
