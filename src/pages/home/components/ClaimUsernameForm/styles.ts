import { styled, Box, Text } from '@ratex-ui/react'

export const Form = styled(Box, {
  display: 'grid',
  gridTemplateColumns: '1fr auto',
  gap: '$2',
  marginTop: '$4',
  padding: '$4',

  '@xs': {
    gridTemplateColumns: '1fr',
  },
})

export const FormValidationError = styled('div', {
  marginTop: '$4',
  position: 'absolute',

  [`> ${Text}`]: {
    color: '$red400',
  },
})
