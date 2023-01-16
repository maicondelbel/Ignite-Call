import { Heading, Text, MultiStep, Button } from '@ratex-ui/react'
import { Container, Form, Header } from '../styles'
import { ArrowRight, Check } from 'phosphor-react'
import { ConnectBox, RegisterValidationError } from './styles'
import { signIn, useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import { NextSeo } from 'next-seo'
import { useEffect } from 'react'

export default function ConnectCalendar() {
  const router = useRouter()
  const session = useSession()

  window.addEventListener('beforeunload', (ev) => {
    ev.preventDefault()
    return ev.returnValue
  })

  useEffect(() => {
    window.addEventListener('beforeunload', (ev) => {
      ev.preventDefault()
      return ev.returnValue
    })

    return () => {
      window.removeEventListener('beforeunload', (ev) => {
        ev.preventDefault()
        return ev.returnValue
      })
    }
  }, [])

  const hasAuthError = !!router.query.error
  const isAuthenticated = session.status === 'authenticated'

  async function handleSignIn() {
    await signIn('google')
  }

  async function handleGoToNextStep() {
    await router.push('/register/time-intervals')
  }

  return (
    <>
      <NextSeo
        title="Ignite Call | Conecte à sua agenda do Google"
        noindex
        description="Conecte seu calendário e permita que as pessoas marquem agendamentos no seu tempo livre."
      />

      <Container>
        <Header>
          <Heading as="strong">Conecte sua agenda!</Heading>
          <Text>
            Conecte o seu calendário para verificar automaticamente as horas
            ocupadas e os novos eventos à medida em que são agendados.
          </Text>
          <MultiStep steps={4} currentStep={2} />
        </Header>
        <Form>
          <ConnectBox>
            <Text>Google Agenda</Text>
            {isAuthenticated ? (
              <Button size="sm" disabled>
                Conectado
                <Check />
              </Button>
            ) : (
              <Button variant="secondary" size="sm" onClick={handleSignIn}>
                Conectar
                <ArrowRight />
              </Button>
            )}
          </ConnectBox>
          {hasAuthError && (
            <RegisterValidationError size="sm">
              Falha ao conectar-se ao Google! Verifique se você concedeu
              permissão de acesso ao Google Calendar
            </RegisterValidationError>
          )}
          <Button
            type="submit"
            disabled={!isAuthenticated}
            onClick={() => handleGoToNextStep()}
          >
            Próximo passo
            <ArrowRight />
          </Button>
        </Form>
      </Container>
    </>
  )
}
