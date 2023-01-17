import { styled, Text } from '@ratex-ui/react'

export const ConnectBox = styled('div', {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  border: '1px solid $gray600',
  padding: '$4 $6',
  borderRadius: '$md',
  gap: '$4',

  '@xs': {
    flexDirection: 'column',

    button: {
      width: '100%',
    },
  },
})

export const RegisterValidationError = styled(Text, {
  color: '#f75a68',
})

export const LogoutBox = styled('div', {
  display: 'flex',
  gap: '$2',
  justifyContent: 'flex-end',
  alignItems: 'center',

  '> p': {
    color: '$gray400',
  },

  a: {
    color: '$ignite500',
    padding: '0 $1',
    fontWeight: '$bold',
    cursor: 'pointer',
  },

  span: {
    fontWeight: '$bold',
    color: '$gray100',
  },
})
