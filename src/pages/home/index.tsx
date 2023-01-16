import {
  Container,
  WrapperContent,
  FormContainer,
  ImageContainer,
  MaskContainer,
} from './styles'
import { Heading, Text } from '@ratex-ui/react'
import { ClaimUsernameForm } from '../home/components/ClaimUsernameForm'
import Image from 'next/image'

export default function Banner() {
  return (
    <Container>
      <WrapperContent>
        <MaskContainer>
          <FormContainer>
            <Heading as="h1" size={'4xl'}>
              Agendamento descomplicado
            </Heading>
            <Text size="xl">
              Conecte seu calendário e permita que as pessoas marquem
              agendamentos no seu tempo livre.
            </Text>
            <ClaimUsernameForm />
          </FormContainer>
        </MaskContainer>
        <ImageContainer>
          <Image
            src="/calendar.svg"
            height={442}
            width={827}
            quality={100}
            priority
            alt="Imagem de calendário com opções de agendamento por dia e horário"
          />
        </ImageContainer>
      </WrapperContent>
    </Container>
  )
}
