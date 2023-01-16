import { Heading, styled, Text } from '@ratex-ui/react'

export const Container = styled('div', {
  maxWidth: 890,

  margin: '$20 auto $4',
  padding: '0 $6',
})

export const ProfileHeader = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',

  [`> ${Heading}`]: {
    lineHeight: '$base',
    marginTop: '$2',
  },

  [`> ${Text}`]: {
    color: '$gray200',
  },
})
