export default ({ layout }) =>
  ({ content, isHTMX }) =>
    String.raw`${!isHTMX ? layout({ content }) : content}`
