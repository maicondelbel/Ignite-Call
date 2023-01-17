import { CircleNotch } from 'phosphor-react'
import { LoaderContainer } from './styles'

export function Loader() {
  return (
    <LoaderContainer>
      <CircleNotch size={32}>
        <animateTransform
          attributeName="transform"
          attributeType="XML"
          type="rotate"
          dur="1s"
          from="0 0 0"
          to="360 0 0"
          repeatCount="indefinite"
        ></animateTransform>
      </CircleNotch>
    </LoaderContainer>
  )
}
