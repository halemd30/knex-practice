require('dotenv').config()
const knex = require('knex')

const knexInstance = knex({
  client: 'pg',
  connection: process.env.DB_URL
})

function itemsContainingText(searchTerm) {
  knexInstance
    .select('name', 'price', 'category', 'checked', 'date_added')
    .from('shopping_list')
    .where('name', 'ILIKE', `%${searchTerm}%`)
    .then(result => {
      console.log(result)
    })
}

itemsContainingText('burger')

function itemsPaginated(page) {
  const productsPerPage = 6
  const offset = productsPerPage * (page - 1)

  knexInstance
    .select('name', 'price', 'category', 'checked', 'date_added')
    .from('shopping_list')
    .limit(productsPerPage)
    .offset(offset)
    .then(result => {
      console.log(result)
    })
}

itemsPaginated(3)

function itemsAddedAfterDate(daysAgo) {
  knexInstance
    .select('name', 'category')
    .from('shopping_list')
    .where('date_added', '>', knexInstance.raw(`now() - '?? days'::INTERVAL`, daysAgo))
    .then(result => {
      console.log(result)
    })
}

itemsAddedAfterDate(20)

function costPerCategory() {
  knexInstance
    .select('name', 'price', 'category', 'checked', 'date_added')
    .from('shopping_list')
    .groupBy('category', 'price')
}