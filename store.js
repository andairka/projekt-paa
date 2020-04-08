const storage = require('azure-storage')
const service = storage.createTableService()
const table = 'tasks'
const uuid = require('uuid')
const moment = require('moment')

const init = async () => (
  new Promise((resolve, reject) => {
    service.createTableIfNotExists(table, (error, result, response) => {
      !error ? resolve() : reject()
    })
  })
)

const createTask = async (title, opis) => (
  new Promise((resolve, reject) => {
    const data = moment().format('MMMM Do YYYY, h:mm:ss a');
    const generator = storage.TableUtilities.entityGenerator
    const task = {
      PartitionKey: generator.String('task'),
      RowKey: generator.String(uuid.v4()),
      title,
      opis,
      data
    }

    service.insertEntity(table, task, (error, result, response) => {
      !error ? resolve() : reject()
    })
  })
)

const listTasks = async () => (
  new Promise((resolve, reject) => {
    const query = new storage.TableQuery()
      .select(['title', 'opis', 'data'])
      .where('PartitionKey eq ?', 'task')

    service.queryEntities(table, query, null, (error, result, response) => {
      !error ? resolve(result.entries.map((entry) => {
	var opis = entry.opis._ !== null ? entry.opis._ : 'Brak wartosci';      
	var data = entry.data._;
        return { 
		"title": entry.title._,
		"opis": opis,
		"data": data
	};
      })) : reject()
    })
  })
)


module.exports = {
  init,
  createTask,
  listTasks
}
