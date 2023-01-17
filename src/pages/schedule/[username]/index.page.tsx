import { Avatar, Text, Heading } from '@ratex-ui/react'
import { GetStaticPaths, GetStaticProps } from 'next'
import { Container, ProfileHeader } from './styles'
import { prisma } from './../../../lib/prisma'
import ScheduleForm from './ScheduleForm'
import { NextSeo } from 'next-seo'

interface IUserProfileProps {
  userProfile: {
    name: string
    bio: string
    avatarUrl: string
  }
}

export default function Schedule({ userProfile }: IUserProfileProps) {
  return (
    <>
      <NextSeo
        title={`Ignite Call | Agendar com ${userProfile.name}`}
        description="Conecte seu calendário e permita que as pessoas marquem agendamentos no seu tempo livre."
      />

      <Container>
        <ProfileHeader>
          <Avatar src={userProfile.avatarUrl} />
          <Heading>{userProfile.name}</Heading>
          <Text>{userProfile.bio}</Text>
        </ProfileHeader>
        <ScheduleForm />
      </Container>
    </>
  )
}

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [],
    fallback: 'blocking',
  }
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const username = String(params?.username)

  const user = await prisma.user.findUnique({
    where: {
      username,
    },
  })

  if (!user) {
    return {
      notFound: true,
    }
  }

  return {
    props: {
      userProfile: {
        name: user.name,
        bio: user.bio,
        avatarUrl: user.avatar_url,
      },
    },
    revalidate: 60 * 60 * 24, // 1 day
  }
}
