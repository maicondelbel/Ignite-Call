import { Heading, styled, Text } from '@ratex-ui/react'

export const Container = styled('div', {
  height: '100vh',
  display: 'flex',
  alignItems: 'center',
  backgroundImage: 'url(/form-background.png)',
  backgroundSize: 'auto',
  backgroundPosition: '10% center',
  backgroundRepeat: 'no-repeat',
})

export const WrapperContent = styled('div', {
  maxWidth: 'calc(100vw - (100vw - 1200px)/2)',
  gap: 92,
  margin: '0 auto',
  display: 'flex',
  alignItems: 'center',
  width: '100%',
  overflow: 'hidden',
})

export const MaskContainer = styled('div', {
  display: 'flex',
  alignItems: 'center',
  flex: `1 50%`,
  justifyContent: 'end',

  '@sm': {
    justifyContent: 'center',
  },
})

export const FormContainer = styled('div', {
  padding: '0 $10',
  maxWidth: 520,

  [`> ${Heading}`]: {
    '@xxs': {
      fontSize: '$6xl',
    },
    '@media(max-width: 375px)': {
      fontSize: '$5xl',
    },
  },

  [`> ${Text}`]: {
    marginTop: '$2',
    color: '$gray200',

    '@xs': {
      fontSize: '$md',
    },
  },
})

export const ImageContainer = styled('div', {
  flex: '1 50%',

  '@sm': {
    display: 'none',
  },
})
