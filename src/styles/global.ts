import { globalCss } from '@ratex-ui/react'

export const globalStyles = globalCss({
  '*': {
    boxSizing: 'border-box',
    padding: 0,
    margin: 0,
  },

  body: {
    backgroundColor: '$gray900',
    color: '$gray100',
    '-webkit-font-smoothing': 'antialiased',
  },

  '::-webkit-scrollbar': {
    width: '10px',
  },

  '::-webkit-scrollbar-track': {
    background: '$gray800',
  },

  '::-webkit-scrollbar-thumb': {
    borderRadius: '$sm',
    background: '$gray600',
  },

  '::-webkit-scrollbar-thumb:hover': {
    background: '$gray500',
  },
})
