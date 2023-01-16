import { Box, styled, Text } from '@ratex-ui/react'

export const ConfirmForm = styled(Box, {
  maxWidth: 540,
  padding: '$6',
  margin: '$6 auto 0',
  display: 'flex',
  flexDirection: 'column',
  gap: '$6',

  label: {
    display: 'flex',
    flexDirection: 'column',
    gap: '$2',
  },
})

export const ConfirmHeader = styled('div', {
  display: 'flex',
  gap: '$4',
  paddingBottom: '$6',
  borderBottom: '1px solid $gray600',

  [`>${Text}`]: {
    display: 'flex',
    alignItems: 'center',
    gap: '$2',

    svg: {
      width: '$5',
      height: '$5',
    },
  },
})

export const ConfirmError = styled(Text, {
  color: '#f75a68',
})

export const ConfirmActions = styled('div', {
  display: 'flex',
  justifyContent: 'flex-end',
  gap: '$2',
})
