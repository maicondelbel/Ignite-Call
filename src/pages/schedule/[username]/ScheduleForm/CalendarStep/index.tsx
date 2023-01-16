import { Calendar } from '../../../../../components/Calendar'
import {
  Container,
  TimePicker,
  TimePickerContainer,
  TimePickerHeader,
  TimePickerHeaderContainer,
  TimePickerItem,
  TimePickerList,
} from './styles'
import dayjs from 'dayjs'
import { api } from '../../../../../lib/axios'
import { useRouter } from 'next/router'
import { useContext, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { X } from 'phosphor-react'
import { Toast, Tooltip } from '@ratex-ui/react'
import { ToastContext } from './../../../../../contexts/ToastContext'

interface IAvailability {
  unavailableTimesToSchedule: string[]
  possibleTimesToSchedule: number[]
}

interface ICalendarStepProps {
  onSelectScheduleDateTime: (date: Date) => void
}

export default function CalendarStep({
  onSelectScheduleDateTime,
}: ICalendarStepProps) {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const { openToast, setOpenToast, toastBody } = useContext(ToastContext)

  const router = useRouter()
  const username = String(router.query.username)
  const formattedDate = dayjs(selectedDate).format('YYYY-MM-DD')

  const { data: availability } = useQuery<IAvailability>(
    ['availability', formattedDate],
    async () => {
      const response = await api.get(`/users/${username}/availability`, {
        params: {
          date: formattedDate,
        },
      })

      return response.data
    },
    {
      enabled: !!selectedDate,
    },
  )

  const unavailableTimes = availability?.unavailableTimesToSchedule.map(
    (unavailableTime) => {
      return dayjs(unavailableTime).get('hour')
    },
  )

  const isDateSelected = !!selectedDate

  const selectedDayWeek = selectedDate
    ? dayjs(selectedDate).format('dddd')
    : null

  const selectedDateAndMonth = selectedDate
    ? dayjs(selectedDate).format('DD[ de ]MMMM')
    : null

  function handleSelectScheduleTime(hour: number) {
    const dateTime = dayjs(selectedDate)
      .set('hour', hour)
      .startOf('hour')
      .toDate()
    onSelectScheduleDateTime(dateTime)
  }

  return (
    <Container isTimePickerOpen={isDateSelected}>
      <Calendar onSelectDate={setSelectedDate} selectedDate={selectedDate} />
      {isDateSelected && (
        <TimePickerContainer>
          <TimePickerHeaderContainer>
            <TimePickerHeader>
              {selectedDayWeek} <span>{selectedDateAndMonth}</span>
            </TimePickerHeader>
            <button
              onClick={() => {
                setSelectedDate(null)
              }}
            >
              <X />
            </button>
          </TimePickerHeaderContainer>
          <TimePicker>
            <TimePickerList>
              {availability?.possibleTimesToSchedule.map((hour) => {
                const isUnavailable =
                  unavailableTimes?.includes(hour) ||
                  dayjs(selectedDate).set('hour', hour).isBefore(new Date())
                return (
                  <Tooltip
                    key={String(hour)}
                    content={`${String(hour).padStart(2, '0')}:00h - ${
                      isUnavailable ? 'Indisponível' : 'Disponível'
                    } `}
                    side="top"
                  >
                    <TimePickerItem
                      onClick={() => {
                        handleSelectScheduleTime(hour)
                      }}
                      key={hour}
                      disabled={isUnavailable}
                    >
                      {String(hour).padStart(2, '0')}:00h
                    </TimePickerItem>
                  </Tooltip>
                )
              })}
            </TimePickerList>
          </TimePicker>
        </TimePickerContainer>
      )}
      <Toast
        title={toastBody.title}
        content={toastBody.content}
        open={openToast}
        onOpenChange={setOpenToast}
      />
    </Container>
  )
}
