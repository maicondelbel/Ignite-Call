import { styled } from '@ratex-ui/react'

export const IntervalContainer = styled('div', {
  border: '1px solid $gray600',
  borderRadius: '$md',
})

export const IntervalItem = styled('div', {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '$3 $4',

  '& + &': {
    borderTop: '1px solid $gray600',
  },
})

export const IntervalItemDays = styled('div', {
  display: 'flex',
  alignItems: 'center',
  gap: '$3',
})

export const IntervalItemInput = styled('div', {
  display: 'flex',
  alignItems: 'center',
  gap: '$2',

  'input::-webkit-calendar-picker-indicator': {
    filter: 'invert(100%) brightness(40%)',
  },

  '@xs': {
    flexDirection: 'column',
  },
})
