export default function createViewWrapper({ layout }) {
  return ({ content, isHTMX }) => {
    return String.raw`${!isHTMX ? layout({ content }) : content}`
  }
}
