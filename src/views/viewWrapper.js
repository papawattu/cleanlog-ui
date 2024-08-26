export default ({ layout }) =>
  ({ content, isHTMX, user = null }) =>
    String.raw`${!isHTMX ? layout({ content, user }) : content}`
