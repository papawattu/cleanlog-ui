export const titleHelper = (title) => String.raw`<title>${title}</title>`
export const isHTMX = (req) => req.get('HX-Request')
