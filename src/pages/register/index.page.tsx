import {
  Heading,
  Text,
  MultiStep,
  TextInput,
  Button,
  Toast,
} from '@ratex-ui/react'
import { z } from 'zod'

import { AxiosError } from 'axios'

import { Container, Form, FormValidationError, Header } from './styles'
import { ArrowRight } from 'phosphor-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/router'
import { useContext, useEffect } from 'react'
import { api } from './../../lib/axios'
import { NextSeo } from 'next-seo'
import { ToastContext } from '../../contexts/ToastContext'

const registerFormSchema = z.object({
  username: z
    .string()
    .min(3, { message: 'O usuário deve ter pelo menos 3 letras' })
    .regex(/^([a-z\\-]+)$/i, {
      message: 'O usuário pode ter apenas letras e hifens',
    })
    .transform((value) => value.toLowerCase()),
  name: z
    .string()
    .min(3, { message: 'O usuário deve ter pelo menos 3 letras' }),
})

type RegisterFormData = z.infer<typeof registerFormSchema>

export default function Register() {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerFormSchema),
  })

  const { setOpenToast, openToast, toastBody, onSetToastBody } =
    useContext(ToastContext)

  const router = useRouter()

  useEffect(() => {
    if (router.query.username) {
      setValue('username', String(router.query.username))
    }
  }, [router.query.username, setValue])

  async function handleRegister(data: RegisterFormData) {
    try {
      await api.post('/users', {
        name: data.name,
        username: data.username,
      })

      await router.push('/register/connect-calendar')
    } catch (error) {
      if (error instanceof AxiosError && error.response?.data.message) {
        onSetToastBody({
          title: 'Houve um problema',
          content: error.response.data.message,
        })
        setOpenToast(true)
      }
    }
  }

  return (
    <>
      <NextSeo
        title="Ignite Call | Crie sua conta"
        description="Conecte seu calendário e permita que as pessoas marquem agendamentos no seu tempo livre."
      />

      <Container>
        <Header>
          <Heading as="strong">Bem-vindo ao Ignite Call!</Heading>
          <Text>
            Precisamos de algumas informações para criar seu perfil! Ah, você
            pode editar essas informações depois.
          </Text>
          <MultiStep steps={4} currentStep={1} />
        </Header>
        <Form as="form" onSubmit={handleSubmit(handleRegister)}>
          <label>
            <Text size="sm">Nome de usuário</Text>
            <TextInput
              prefix="ignite.com/"
              placeholder="seu-usuario"
              {...register('username')}
            />
            <FormValidationError size="sm">
              {errors.username && errors.username.message}
            </FormValidationError>
          </label>
          <label>
            <Text size="sm">Nome completo</Text>
            <TextInput placeholder="Seu nome" {...register('name')} />
            <FormValidationError size="sm">
              {errors.name && errors.name.message}
            </FormValidationError>
          </label>
          <Button type="submit" disabled={isSubmitting}>
            Próximo passo
            <ArrowRight />
          </Button>
        </Form>
        <Toast
          title={toastBody.title}
          content={toastBody.content}
          open={openToast}
          onOpenChange={setOpenToast}
        />
      </Container>
    </>
  )
}
