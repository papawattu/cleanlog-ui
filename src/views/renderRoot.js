import { render } from 'lit-html'
import mainView from './mainView'

export function RenderRoot({ props: { avatar, name } }) {
  render(mainView({ avatar, name }), document.getElementById('root'))
}
