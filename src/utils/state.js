import { RenderRoot } from '../views/renderRoot'

export function createState({ initialProps }) {
  const state = { props: initialProps }
  return {
    props: initialProps,
    setProps: (newProps) => {
      state.props = newProps
      //RenderRoot({ props: state.props })
    },
    getProps: () => state.props,
  }
}
