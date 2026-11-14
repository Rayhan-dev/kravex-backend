import { createHmac } from "node:crypto"
import type { SubscriberArgs, SubscriberConfig } from "@medusajs/medusa"

type CatalogEvent = {
  event: string
  id: string
  occurred_at: string
}

const MAX_ATTEMPTS = 3

const wait = (milliseconds: number) =>
  new Promise((resolve) => setTimeout(resolve, milliseconds))

export default async function storefrontCacheInvalidationHandler({
  event: { data, name },
  container,
}: SubscriberArgs<{ id: string }>) {
  const endpoint = process.env.STOREFRONT_CACHE_WEBHOOK_URL
  const secret = process.env.STOREFRONT_CACHE_WEBHOOK_SECRET
  const logger = container.resolve("logger")

  if (!endpoint || !secret) {
    logger.warn(
      "Skipping storefront cache invalidation: webhook URL or secret is not configured"
    )
    return
  }

  const payload: CatalogEvent = {
    event: name,
    id: data.id,
    occurred_at: new Date().toISOString(),
  }
  const body = JSON.stringify(payload)

  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt += 1) {
    const timestamp = Math.floor(Date.now() / 1000).toString()
    const signature = createHmac("sha256", secret)
      .update(`${timestamp}.${body}`)
      .digest("hex")

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "content-type": "application/json",
          "x-kravex-webhook-timestamp": timestamp,
          "x-kravex-webhook-signature": signature,
        },
        body,
      })

      if (response.ok) {
        logger.info(
          `Storefront cache invalidated for ${name} (${data.id})`
        )
        return
      }

      throw new Error(`Webhook returned HTTP ${response.status}`)
    } catch (error) {
      if (attempt === MAX_ATTEMPTS) {
        logger.error(
          `Storefront cache invalidation failed for ${name} (${data.id}): ${
            error instanceof Error ? error.message : String(error)
          }`
        )
        throw error
      }

      await wait(250 * 2 ** (attempt - 1))
    }
  }
}

export const config: SubscriberConfig = {
  event: [
    "product.created",
    "product.updated",
    "product.deleted",
    "product-variant.created",
    "product-variant.updated",
    "product-variant.deleted",
    "inventory-level.created",
    "inventory-level.updated",
    "inventory-level.deleted",
    "price-list.created",
    "price-list.updated",
    "price-list.deleted",
    "promotion.created",
    "promotion.updated",
    "promotion.deleted",
  ],
}
