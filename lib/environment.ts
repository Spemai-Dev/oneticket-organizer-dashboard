export const environment = {
  // BASE_URL: process.env.NEXT_PUBLIC_BASE_URL || 'https://merchant-api-live-v2.onepay.lk/api',
  // BASE_URL_NEW: process.env.NEXT_PUBLIC_BASE_URL_NEW || 'https://oneticket-live.onepayapi.lk/api/v3/',


  BASE_URL_LIVE: 'https://oneticket-live.onepayapi.lk/api/v3/',

  BASE_URL_UAT: 'https://oneticket-uat.onepayapi.lk/api/v3/',

  TICKET_PAGE_URL_LIVE: 'https://tickets.oneticket.lk',
  TICKET_PAGE_URL_UAT: 'https://zealous-island-03dd9d810.3.azurestaticapps.net',

  aws: 'https://storage.googleapis.com/oneticket',
  IMAGE_BASE_URL: 'https://storage.googleapis.com/oneticket',
};

export const base_url_new = environment.BASE_URL_UAT;

export const ticket_page_base_url =
  base_url_new === environment.BASE_URL_LIVE
    ? environment.TICKET_PAGE_URL_LIVE
    : environment.TICKET_PAGE_URL_UAT;
