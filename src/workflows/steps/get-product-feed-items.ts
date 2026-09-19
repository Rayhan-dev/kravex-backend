import { createStep, StepResponse } from "@medusajs/framework/workflows-sdk"
import { ContainerRegistrationKeys, getVariantAvailability, QueryContext } from "@medusajs/framework/utils"
import { CalculatedPriceSet } from "@medusajs/framework/types"

export type FeedItem = {
  id: string
  title: string
  description: string
  link: string
  image_link?: string
  additional_image_link?: string
  availability: string
  price: string
  sale_price?: string
  item_group_id: string
  condition?: string
  brand?: string
}

const formatPrice = (price: number, currency_code: string) => {
  return `${new Intl.NumberFormat("en-US", {
    currency: currency_code,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(price)} ${currency_code.toUpperCase()}`
}

type StepInput = {
  currency_code: string
  country_code: string
}

export const getProductFeedItemsStep = createStep(
  "get-product-feed-items", 
  async (input: StepInput, { container }) => {
    const feedItems: FeedItem[] = []
const query = container.resolve(ContainerRegistrationKeys.QUERY)
const configModule = container.resolve(
  ContainerRegistrationKeys.CONFIG_MODULE
)
const storefrontUrl = configModule.admin.storefrontUrl || 
  process.env.STOREFRONT_URL

const limit = 100
let offset = 0
let count = 0
const countryCode = input.country_code.toLowerCase()
const currencyCode = input.currency_code.toLowerCase()

do {
  const {
    data: products,
    metadata,
  } = await query.graph({
    entity: "product",
    fields: [
      "id",
      "title",
      "description",
      "handle",
      "thumbnail",
      "images.*",
      "status",
      "variants.*",
      "variants.calculated_price.*",
      "sales_channels.*",
      "sales_channels.stock_locations.*",
      "sales_channels.stock_locations.address.*",
    ],
    filters: {
      status: "published",
    },
    context: {
      variants: {
        calculated_price: QueryContext({
          currency_code: currencyCode,
        }),
      },
    },
    pagination: {
      take: limit,
      skip: offset,
    },
  })
  
  count = metadata?.count ?? 0
  offset += limit

  // TODO prepare feed data
} while (count > offset)

return new StepResponse({ items: feedItems })
    
  }
)