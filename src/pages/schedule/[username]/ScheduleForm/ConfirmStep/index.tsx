import { Button, Text, TextArea, TextInput, Toast } from '@ratex-ui/react'
import { CalendarBlank, Clock } from 'phosphor-react'
import {
  ConfirmActions,
  ConfirmError,
  ConfirmForm,
  ConfirmHeader,
} from './styles'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import dayjs from 'dayjs'
import { api } from './../../../../../lib/axios'
import { useRouter } from 'next/router'
import { useContext } from 'react'
import { ToastContext } from './../../../../../contexts/ToastContext'

const confirmFormSchema = z.object({
  name: z
    .string()
    .min(3, { message: 'O nome precisa ter mais de 3 caracteres' }),
  email: z.string().email({ message: 'Digite um e-mail válido' }),
  notes: z.string().nullable(),
})

type ConfirmFormData = z.infer<typeof confirmFormSchema>

interface IConfirmStepProps {
  scheduleDateTime: Date
  onClearScheduleDateTime: () => void
}

export default function ConfirmStep({
  scheduleDateTime,
  onClearScheduleDateTime,
}: IConfirmStepProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ConfirmFormData>({ resolver: zodResolver(confirmFormSchema) })

  const { setOpenToast, openToast, toastBody, onSetToastBody } =
    useContext(ToastContext)

  const router = useRouter()
  const username = String(router.query.username)

  async function handleConfirm(data: ConfirmFormData) {
    try {
      const { name, email, notes } = data
      await api.post(`/users/${username}/schedule`, {
        name,
        email,
        notes,
        date: scheduleDateTime,
      })
      onSetToastBody({
        title: 'Agendamento realizado',
        content: dayjs(scheduleDateTime).format(
          'dddd[, ]DD[ de ]MMMM[ às ]HH:mm',
        ),
      })
      setOpenToast(true)
      onClearScheduleDateTime()
    } catch (error) {
      onSetToastBody({
        title: 'Agendamento não realizado',
        content: 'Houve um erro ao tentar agendar',
      })
      setOpenToast(true)
      onClearScheduleDateTime()
    }
  }

  const fullDate = dayjs(scheduleDateTime).format('DD[ de ]MMMM[ de ]YYYY')
  const fullTime = dayjs(scheduleDateTime).format('HH:mm[h]')

  return (
    <ConfirmForm as="form" onSubmit={handleSubmit(handleConfirm)}>
      <ConfirmHeader>
        <Text>
          <CalendarBlank />
          {fullDate}
        </Text>
        <Text>
          <Clock />
          {fullTime}
        </Text>
      </ConfirmHeader>
      <label>
        <Text size="sm">Seu nome</Text>
        <TextInput {...register('name')} />
        {errors.name && (
          <ConfirmError size="sm">{errors.name.message}</ConfirmError>
        )}
      </label>
      <label>
        <Text size="sm">Endereço de e-mail</Text>
        <TextInput {...register('email')} />
        {errors.email && (
          <ConfirmError size="sm">{errors.email.message}</ConfirmError>
        )}
      </label>
      <label>
        <Text size="sm">Observações</Text>
        <TextArea {...register('notes')} />
      </label>
      <ConfirmActions>
        <Button
          type="button"
          variant="tertiary"
          onClick={onClearScheduleDateTime}
        >
          Cancelar
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          Confirmar
        </Button>
      </ConfirmActions>
      <Toast
        title={toastBody.title}
        content={toastBody.content}
        open={openToast}
        onOpenChange={setOpenToast}
      />
    </ConfirmForm>
  )
}
