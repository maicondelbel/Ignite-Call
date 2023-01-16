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
