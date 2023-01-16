import { Tooltip } from '@ratex-ui/react'
import { useQuery } from '@tanstack/react-query'
import dayjs from 'dayjs'
import { useRouter } from 'next/router'
import { CaretLeft, CaretRight } from 'phosphor-react'
import { useMemo, useState } from 'react'
import { api } from '../../lib/axios'
import { getWeekDays } from './../../utils/get-week-days'
import {
  CalendarActions,
  CalendarBody,
  CalendarContainer,
  CalendarDay,
  CalendarHeader,
  CalendarTitle,
} from './style'

interface ICalendarWeek {
  week: number
  days: Array<{
    date: dayjs.Dayjs
    disabled: boolean
  }>
}

interface ICalendarProps {
  selectedDate: Date | null
  onSelectDate: (date: Date) => void
}

interface IUnavailabilityDates {
  unavailableWeekDays: number[]
  unavailabilityDates: number[]
}

export function Calendar({ onSelectDate, selectedDate }: ICalendarProps) {
  const [currentDate, setCurrentDate] = useState(() => {
    return dayjs().set('date', 1)
  })

  const currentMonth = currentDate.format('MMMM')
  const currentYear = currentDate.format('YYYY')

  const router = useRouter()
  const username = String(router.query.username)

  function handlePreviewMonth() {
    const previousMonthDate = currentDate.subtract(1, `month`)
    setCurrentDate(previousMonthDate)
  }

  function handleNextMonth() {
    const nextMonthDate = currentDate.add(1, `month`)
    setCurrentDate(nextMonthDate)
  }

  const { data: unavailabilityDates } = useQuery<IUnavailabilityDates>(
    ['unavailability', currentDate.get('year'), currentDate.get('month')],
    async () => {
      const response = await api.get(`/users/${username}/unavailability`, {
        params: {
          year: currentDate.get('year'),
          month: String(currentDate.get('month') + 1).padStart(2, '0'),
        },
      })

      return response.data
    },
  )

  const calendarWeeks = useMemo(() => {
    if (!unavailabilityDates) {
      return []
    }
    const daysInMonthArray = Array.from({
      length: currentDate.daysInMonth(),
    }).map((_, i) => {
      return currentDate.set('date', i + 1)
    })

    const firstWeekDay = currentDate.get('day')

    const lastDaysInPreviousMonth = Array.from({ length: firstWeekDay })
      .map((_, i) => {
        return currentDate.subtract(i + 1, 'day')
      })
      .reverse()

    const lastDayInCurrentMonth = currentDate.set(
      'date',
      currentDate.daysInMonth(),
    )

    const lastWeekDay = lastDayInCurrentMonth.get('day')

    const firstDaysInNextMonth = Array.from({
      length: 7 - (lastWeekDay + 1),
    }).map((_, i) => {
      return lastDayInCurrentMonth.add(i + 1, 'day')
    })

    const calendarDays = [
      ...lastDaysInPreviousMonth.map((date) => {
        return { date, disabled: true }
      }),
      ...daysInMonthArray.map((date) => {
        return {
          date,
          disabled:
            date.endOf('day').isBefore(new Date()) ||
            unavailabilityDates.unavailableWeekDays.includes(date.get('day')) ||
            unavailabilityDates.unavailabilityDates.includes(date.get('date')),
        }
      }),
      ...firstDaysInNextMonth.map((date) => {
        return { date, disabled: true }
      }),
    ]

    const calendarWeeks = calendarDays.reduce<ICalendarWeek[]>(
      (weeks, _, i, original) => {
        const isNewWeek = i % 7 === 0
        if (isNewWeek) {
          weeks.push({ week: i / 7 + 1, days: original.slice(i, i + 7) })
        }
        return weeks
      },
      [],
    )

    return calendarWeeks
  }, [currentDate, unavailabilityDates])

  const weekDays = getWeekDays({ short: true })

  return (
    <CalendarContainer>
      <CalendarHeader>
        <CalendarTitle>
          {currentMonth} <span>{currentYear}</span>
        </CalendarTitle>
        <CalendarActions>
          <button onClick={handlePreviewMonth}>
            <CaretLeft />
          </button>
          <button onClick={handleNextMonth}>
            <CaretRight />
          </button>
        </CalendarActions>
      </CalendarHeader>

      <CalendarBody>
        <thead>
          <tr>
            {weekDays.map((weekDay) => {
              return <th key={weekDay}>{weekDay}.</th>
            })}
          </tr>
        </thead>
        <tbody>
          {calendarWeeks.map(({ week, days }) => {
            return (
              <tr key={week}>
                {days.map(({ date, disabled }) => {
                  return (
                    <td key={date.toString()}>
                      <Tooltip
                        content={`${dayjs(date).format('DD[ de ]MMMM')} - ${
                          disabled ? 'Indisponível' : 'Disponível'
                        }`}
                        side={'top'}
                      >
                        <CalendarDay
                          disabled={disabled}
                          onClick={() => onSelectDate(date.toDate())}
                        >
                          {date.get('date')}
                        </CalendarDay>
                      </Tooltip>
                    </td>
                  )
                })}
              </tr>
            )
          })}
        </tbody>
      </CalendarBody>
    </CalendarContainer>
  )
}
