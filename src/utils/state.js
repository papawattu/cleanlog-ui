import { RenderRoot } from '../views/renderRoot'

export function createState({ initialProps }) {
  const state = { props: { ...initialProps } }
  return {
    props: initialProps,
    setProps: (newProps) => {
      console.log('current state.props', JSON.stringify(state.props))

      state.props = { ...state.props, ...newProps }
      console.log('new state.props', JSON.stringify(state.props))
      //RenderRoot({ props: state.props })
    },
    getProps: () => state.props,
  }
}
