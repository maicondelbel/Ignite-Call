import { Box, styled, Text } from '@ratex-ui/react'

export const Container = styled(Box, {
  margin: '$6 auto 0',
  padding: 0,
  display: 'grid',
  maxWidth: '100%',

  variants: {
    isTimePickerOpen: {
      true: {
        gridTemplateColumns: '1fr 300px',

        '@md': {
          borderTop: '1px solid $gray600',
          gridTemplateColumns: '1fr',
          gridTemplateRows: '1fr 1fr',
          width: 540,
        },
      },
      false: {
        width: 540,
        gridTemplateColumns: '1fr',
      },
    },
  },
})

export const TimePickerContainer = styled('div', {
  position: 'relative',
  borderLeft: '1px solid $gray600',

  '@md': {
    borderTop: '1px solid $gray600',
  },
})

export const TimePicker = styled('div', {
  borderTop: '1px solid $gray600',
  padding: '$6 $6 0',
  overflowY: 'scroll',

  position: 'absolute',
  top: 74,
  bottom: 0,
  right: 0,
  width: 300,

  '@md': {
    width: '100%',
  },
})

export const TimePickerHeaderContainer = styled('div', {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '$6',
  gap: '$2',
  color: '$gray200',

  button: {
    all: 'unset',
    cursor: 'pointer',
    lineHeight: 0,
    borderRadius: '$md',

    svg: {
      width: '$5',
      height: '$5',
    },

    '&:hover': {
      color: '$gray100',
    },

    '&:focus': {
      boxShadow: '0 0 0 2px $colors$gray100',
    },
  },
})

export const TimePickerHeader = styled(Text, {
  fontWeight: '$medium',

  span: {
    color: '$gray200',
  },
})

export const TimePickerList = styled('div', {
  display: 'grid',
  gridTemplateColumns: '1fr',
  gap: '$2',

  '@md': {
    gridTemplateColumns: '2fr',
  },
})

export const TimePickerItem = styled('button', {
  width: '100%',
  border: 0,
  backgroundColor: '$gray600',
  padding: '$2 0',
  cursor: 'pointer',
  color: '$gray100',
  borderRadius: '$sm',
  fontSize: '$sm',
  lineHeight: '$base',

  '&:last-child': {
    marginBottom: '$6',
  },

  '&:disabled': {
    background: 'none',
    cursor: 'default',
    opacity: 0.4,
  },

  '&:not(:disabled):hover': {
    background: '$gray500',
  },

  '&:focus': {
    boxShadow: '0 0 0 2px $colors$gray100',
  },
})
