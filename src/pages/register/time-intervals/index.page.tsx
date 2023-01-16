import { zodResolver } from '@hookform/resolvers/zod'
import {
  Heading,
  Text,
  MultiStep,
  Button,
  Checkbox,
  TextInput,
} from '@ratex-ui/react'
import { useRouter } from 'next/router'
import { ArrowRight } from 'phosphor-react'
import { useFieldArray, useForm, Controller } from 'react-hook-form'
import { z } from 'zod'
import { RegisterValidationError } from '../connect-calendar/styles'
import { Container, Header, Form } from '../styles'
import { api } from './../../../lib/axios'
import { convertTimeStringToMinutes } from './../../../utils/convert-time-string-to-minutes'
import { getWeekDays } from './../../../utils/get-week-days'
import { NextSeo } from 'next-seo'
import {
  IntervalContainer,
  IntervalItem,
  IntervalItemDays,
  IntervalItemInput,
} from './styles'

const timeIntervalsFormSchema = z.object({
  intervals: z
    .array(
      z.object({
        weekDay: z.number().min(0).max(6),
        enabled: z.boolean(),
        startTime: z.string(),
        endTime: z.string(),
      }),
    )
    .length(7)
    .transform((intervals) =>
      intervals.filter((intervals) => intervals.enabled),
    )
    .refine((intervals) => intervals.length > 0, {
      message: 'Você precisa selecionar pelo menos um dia da semana!',
    })
    .transform((intervals) => {
      return intervals.map((interval) => {
        return {
          weekday: interval.weekDay,
          startTimeInMinutes: convertTimeStringToMinutes(interval.startTime),
          endTimeInMinutes: convertTimeStringToMinutes(interval.endTime),
        }
      })
    })
    .refine(
      (intervals) => {
        return intervals.every(
          (interval) =>
            interval.endTimeInMinutes - 60 >= interval.startTimeInMinutes,
        )
      },
      {
        message:
          'O horário de término deve ser pelo menos 1h distante do início',
      },
    ),
})

type TimeIntervalsFormInput = z.input<typeof timeIntervalsFormSchema>
type TimeIntervalsFormOutput = z.output<typeof timeIntervalsFormSchema>

export default function TimeInterval() {
  const {
    register,
    control,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<TimeIntervalsFormInput>({
    resolver: zodResolver(timeIntervalsFormSchema),
    defaultValues: {
      intervals: [
        { weekDay: 0, enabled: false, startTime: '08:00', endTime: '18:00' },
        { weekDay: 1, enabled: true, startTime: '08:00', endTime: '18:00' },
        { weekDay: 2, enabled: true, startTime: '08:00', endTime: '18:00' },
        { weekDay: 3, enabled: true, startTime: '08:00', endTime: '18:00' },
        { weekDay: 4, enabled: true, startTime: '08:00', endTime: '18:00' },
        { weekDay: 5, enabled: true, startTime: '08:00', endTime: '18:00' },
        { weekDay: 6, enabled: false, startTime: '08:00', endTime: '18:00' },
      ],
    },
  })

  const intervals = watch('intervals')

  const weekDays = getWeekDays()

  const router = useRouter()

  const { fields } = useFieldArray({ name: 'intervals', control })

  async function handleSetTimeIntervals(data: any) {
    const { intervals } = data as TimeIntervalsFormOutput

    try {
      await api.post('/users/time-intervals', { intervals })
      await router.push('/register/update-profile')
    } catch (error) {
      alert(error)
      console.log(error)
    }
  }

  return (
    <>
      <NextSeo
        title="Ignite Call | Selecione sua disponibilidade"
        noindex
        description="Conecte seu calendário e permita que as pessoas marquem agendamentos no seu tempo livre."
      />

      <Container>
        <Header>
          <Heading as="strong">Quase lá</Heading>
          <Text>
            Defina o intervalo de horários que você está disponível em cada dia
            da semana.
          </Text>
          <MultiStep steps={4} currentStep={3} />
        </Header>

        <Form as="form" onSubmit={handleSubmit(handleSetTimeIntervals)}>
          <IntervalContainer>
            {fields.map((field, index) => {
              return (
                <IntervalItem key={field.id}>
                  <IntervalItemDays>
                    <Controller
                      name={`intervals.${index}.enabled`}
                      control={control}
                      render={({ field }) => {
                        return (
                          <Checkbox
                            onCheckedChange={(checked) => {
                              field.onChange(checked === true)
                            }}
                            checked={field.value}
                          />
                        )
                      }}
                    />
                    <Text>{weekDays[field.weekDay]}</Text>
                  </IntervalItemDays>
                  <IntervalItemInput>
                    <TextInput
                      type="time"
                      step={60}
                      disabled={!intervals[index].enabled}
                      {...register(`intervals.${index}.startTime`)}
                    />
                    <TextInput
                      type="time"
                      step={60}
                      disabled={!intervals[index].enabled}
                      {...register(`intervals.${index}.endTime`)}
                    />
                  </IntervalItemInput>
                </IntervalItem>
              )
            })}
          </IntervalContainer>
          {errors.intervals && (
            <RegisterValidationError size="sm">
              {errors.intervals.message}
            </RegisterValidationError>
          )}
          <Button type="submit" disabled={isSubmitting}>
            Próximo passo
            <ArrowRight />
          </Button>
        </Form>
      </Container>
    </>
  )
}
