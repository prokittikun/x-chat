export interface OgInterface {
    ogTitle: string
    ogDescription: string
    ogImage: OgImageInterface | OgImageInterface[];
    ogLocale: string
    ogUrl: string
    favicon: string
    charset: string
    requestUrl: string
    success: boolean
  }
  
  export interface OgImageInterface {
    url: string
    width?: string
    height: any
    type: string
  }
  