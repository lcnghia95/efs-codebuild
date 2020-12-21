export async function getData(app, route, type = '') {
  let [companies, tieup] = await Promise.all([
    app.GoGoHTTP.get(`/api/v3/surface/company/compare${type}`),
    app.GoGoHTTP.get('/api/v3/surface/campaigns')
  ])
  return {
    companies,
    tieup,
    linkMeta: [
      {
        rel: 'canonical',
        href: `https://www.gogojungle.co.jp${route.path}`,
      },
    ],
  }
}
