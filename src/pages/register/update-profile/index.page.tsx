/* eslint-disable camelcase */
import {
  Heading,
  MultiStep,
  Button,
  Text,
  Avatar,
  TextArea,
} from '@ratex-ui/react'

import { ArrowRight } from 'phosphor-react'
import { Form, Container, Header } from '../styles'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { GetServerSideProps } from 'next'
import { unstable_getServerSession } from 'next-auth'
import { buildNextAuthOptions } from '../../api/auth/[...nextauth].api'
import { useSession } from 'next-auth/react'
import { api } from '../../../lib/axios'
import { useRouter } from 'next/router'
import { NextSeo } from 'next-seo'

const ProfileUpdateFormSchema = z.object({
  bio: z.string(),
})

type ProfileUpdateFormData = z.input<typeof ProfileUpdateFormSchema>

export default function UpdateProfile() {
  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<ProfileUpdateFormData>({
    resolver: zodResolver(ProfileUpdateFormSchema),
  })

  const session = useSession()
  const router = useRouter()

  console.log(session)

  async function handleProfileUpdate(data: ProfileUpdateFormData) {
    try {
      await api.put('/users/profile', { bio: data.bio })
      await router.push(`/schedule/${session.data?.user.username}`)
    } catch (error) {
      alert(error)
      console.log(error)
    }
  }

  return (
    <>
      <NextSeo
        title="Ignite Call | Atualize seu perfil"
        noindex
        description="Conecte seu calendário e permita que as pessoas marquem agendamentos no seu tempo livre."
      />

      <Container>
        <Header>
          <Heading as="strong">Defina sua disponibilidade</Heading>
          <Text>Por último, uma breve descrição e uma foto de perfil.</Text>
          <MultiStep steps={4} currentStep={4} />
        </Header>
        <Form as="form" onSubmit={handleSubmit(handleProfileUpdate)}>
          <label>
            <Text size="sm">Foto de perfil</Text>
            <Avatar
              src={session.data?.user.avatar_url}
              alt={session.data?.user.name}
            />
          </label>
          <label>
            <Text size="sm">Sobre você</Text>
            <TextArea {...register('bio')} />
          </label>
          <Text size="sm">
            Fale um pouco sobre você. Isto será exibido em sua página pessoal.
          </Text>
          <Button type="submit" disabled={isSubmitting}>
            Finalizar
            <ArrowRight />
          </Button>
        </Form>
      </Container>
    </>
  )
}

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  const session = await unstable_getServerSession(
    req,
    res,
    buildNextAuthOptions(req, res),
  )

  return {
    props: {
      session,
    },
  }
}
