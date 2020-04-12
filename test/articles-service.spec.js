const knex = require('knex')
const ArticlesService = require('../src/articles-service')

/**
 * GENERAL NOTE:
 * Be VERY mindful of the use of _implicit returns_ with arrow functions.
 * Pay careful attention to whether the function utilizes curly braces or
 * not:
 * 
 * () => { 
 *   return db().select();
 * }
 *   vs
 * () => 
 *  db().select()
 * 
 * If you receive a strange error, especially errors concerning hooks, 
 * you have probably NOT returned an async function from one or more
 * of your tests. 
 * 
 */

describe(`Articles service object`, function() {
  let db

  // We'll use this array as an example of mock data that represents
  // valid content for our database 
  let testArticles = [
    {
      id: 1,
      date_published: new Date('2029-01-22T16:28:32.615Z'),
      title: 'First test post!',
      content: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Natus consequuntur deserunt commodi, nobis qui inventore corrupti iusto aliquid debitis unde non.Adipisci, pariatur.Molestiae, libero esse hic adipisci autem neque ?'
    },
    {
      id: 2,
      date_published: new Date('2100-05-22T16:28:32.615Z'),
      title: 'Second test post!',
      content: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Cum, exercitationem cupiditate dignissimos est perspiciatis, nobis commodi alias saepe atque facilis labore sequi deleniti. Sint, adipisci facere! Velit temporibus debitis rerum.'
    },
    {
      id: 3,
      date_published: new Date('1919-12-22T16:28:32.615Z'),
      title: 'Third test post!',
      content: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Possimus, voluptate? Necessitatibus, reiciendis? Cupiditate totam laborum esse animi ratione ipsa dignissimos laboriosam eos similique cumque. Est nostrum esse porro id quaerat.'
    },
  ]

  // Prepare the database connection using the `db` variable available
  // in the scope of the primary `describe` block. This means `db`
  // will be available in all of our tests.
  before('setup db', () => {
    db = knex({
      client: 'pg', 
      connection: process.env.TEST_DB_URL
    })
  })

  // Before all tests run and after each individual test, empty the
  // blogful_articles table
  before('clean db', () => db('blogful_articles').truncate())
  afterEach('clean db', () => db('blogful_articles').truncate())

  // After all tests run, let go of the db connection
  after('destroy db connection', () => db.destroy())

  // Whenever we set a context with data present, we should always include
  // a beforeEach() hook within the context that takes care of adding the
  // appropriate data to our table
  context(`Given 'blogful_articles' has data`, () => {
    beforeEach(() => {
      return db
        .into('blogful_articles')
        .insert(testArticles)
    })

    it(`insertArticle() inserts a new article and resolves the new article with an 'id'`, () => {
      const newArticle = {
        title: 'Test new title',
        content: 'Test new content',
        date_published: new Date('2020-01-01T00:00:00.000Z')
      }
      return ArticlesService.insertArticle(db, newArticle)
        .then(actual => {
          expect(actual).to.eql({
            id: 1,
            title: newArticle.title,
            content: newArticle.content,
            date_published: new Date(newArticle.date_published)
          })
        })
    })

    it(`getAllArticles() resolves all articles from 'blogful_articles' table`, () => {
      // test that ArticlesService.getAllArticles gets data from table

      // injecting the knex instance with db
      return ArticlesService.getAllArticles(db)
        .then(actual => {
          expect(actual).to.eql(testArticles.map(article => ({
            ...article,
            date_published: new Date(article.date_published)
          })))
        })
      
    })

    it(`getById() resolves an article by id from 'blogful_articles' table`, () => {
      const thirdId = 3
      const thirdTestArticle = testArticles[thirdId - 1]
      return ArticlesService.getById(db, thirdId)
        .then(actual => {
          expect(actual).to.eql({
            id: thirdId,
            title: thirdTestArticle.title,
            content: thirdTestArticle.content,
            date_published: thirdTestArticle.date_published
          })
        })
    })
  
    it(`deleteArticle() removes an article by id from 'blogful_articles' table`, () => {
      const articleId = 3
      return ArticlesService.deleteArticle(db, articleId)
        .then(() => ArticlesService.getAllArticles(db))
        .then(allArticles => {
          // copy the test articles array without the "deleted" article
          const expected = testArticles.filter(article => article.id !== articleId)
          expect(allArticles).to.eql(expected)
        })
    })

    it(`updateArticle() updates an article from the 'blogful_articles' table`, () => {
      const idOfArticleToUpdate = 3
      const newArticleData = {
        title: 'updated title',
        content: 'updated content',
        date_published: new Date(),
      }
      return ArticlesService.updateArticle(db, idOfArticleToUpdate, newArticleData)
        .then(() => ArticlesService.getById(db, idOfArticleToUpdate))
        .then(article => {
          expect(article).to.eql({
            id: idOfArticleToUpdate,
            ...newArticleData,
          })
        })
    })
  })

  context(`Given 'blogful_articles' has no data`, () => {
    it(`getAllArticles() resolves an empty array`, () => {
      return ArticlesService.getAllArticles(db)
        .then(actual => {
          expect(actual).to.eql([])
        })
    })
  })

  
})