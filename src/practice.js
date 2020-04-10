require('dotenv').config()
const knex = require('knex')

const knexInstance = knex({
  client: 'pg',
  connection: process.env.DB_URL
})

// knexInstance.from('amazong_products').select('*')
//   .then(result => {
//     console.log(result)
//   })

const qry = knexInstance
  .select('product_id', 'name', 'price', 'category')
  .from('amazong_products')
  .where({ name: 'Point of view gun' })
  .first()
  .toQuery()
  // .then(result => {
  //   console.log(result)
  // })
  console.log(qry)


// function searchByProduceName(searchTerm) {
//   knexInstance
//     .select('product_id', 'name', 'price', 'category')
//     .from('amazong_products')
//     .where('name', 'ILIKE', `%${searchTerm}%`)
//     .then(result => {
//       console.log(result)
//     })
// }

// searchByProduceName('holo')

// // pagination:
// function paginateProducts(pageNumber) {
//   const productsPerPage = 10
//   const offset = productsPerPage * (pageNumber - 1)

//   knexInstance
//     .select('product_id', 'name', 'price', 'category')
//     .from('amazong_products')
//     .limit(productsPerPage)
//     .offset(offset)
//     .then(result => {
//       console.log(result)
//     })
// }

// paginateProducts(2)

// // filter by image
// function getProductsWithImages() {
//   knexInstance
//     .select('product_id', 'name', 'price', 'category')
//     .from('amazong_products')
//     .whereNotNull('image')
//     .then(result => {
//       console.log(result)
//     })
// }

// getProductsWithImages()

// // find most popular whopipe video given (days)
// function mostPopularVideosForDays(days) {
//   knexInstance
//     .select('video_name', 'region')
//     .count('date_viewed AS views')
//     .where('date_viewed', '>', knexInstance.raw(`now() - '?? days'::INTERVAL`, days))
//     .from('whopipe_video_views')
//     .groupBy('video_name', 'region')
//     .orderBy([
//       { column: 'region', order: 'ASC' },
//       { column: 'views', order: 'DESC' },
//     ])
//     .then(result => {
//       console.log(result)
//     })
// }

// mostPopularVideosForDays(30)