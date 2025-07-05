import {
  createBitfield
} from "./bitfield.js";

// src/parser.ts
var productFlags = {
  TRASH: 1 << 0,
  THIRDPARTY: 1 << 1,
  PERMANENT: 1 << 2,
  STAFF_PICK: 1 << 3,
  FIRSTPARTY_EXCLUSIVE: 1 << 4
};
var productUrlFlags = {
  ORIGINAL: 1 << 0,
  PROXIED: 1 << 1,
  TRACKING: 1 << 2,
  OPENS_IN_BROWSER: 1 << 3,
  OPENS_IN_CLIENT: 1 << 4
};
var productImageFlags = {
  PROXIED: 1 << 0,
  AR_WIDE: 1 << 1,
  AR_SQUARE: 1 << 2,
  AR_TALL: 1 << 3,
  TP_PROMO: 1 << 4,
  TP_LOGO: 1 << 5,
  TP_SHOWCASE: 1 << 6,
  TP_OTHER: 1 << 7,
  FT_WATERMARK: 1 << 8,
  FT_TAGS: 1 << 9
};
function parseProduct(product) {
  product.until = product.until ? new Date(product.until) : null;
  product.flags = createBitfield(product.flags, productFlags);
  product.urls.forEach((url) => url.flags = createBitfield(url.flags, productUrlFlags));
  product.images.forEach((image) => image.flags = createBitfield(image.flags, productImageFlags));
  return product;
}
function parseResolvedAnnouncement(announcement) {
  announcement.resolvedProducts = announcement.resolvedProducts.map(parseProduct);
  return announcement;
}
function parseEvent(event) {
  if (event.type === "fsb:event:product_updated") {
    event.data = parseProduct(event.data);
  } else if (event.type === "fsb:event:announcement_created") {
    event.data = parseResolvedAnnouncement(event.data);
  }
  event.timestamp = new Date(event.timestamp);
  return event;
}
export {
  parseEvent
};

export { parseEvent };

//# debugId=2BA98D3550277E8664756E2164756E21
//# sourceMappingURL=parser.js.map
