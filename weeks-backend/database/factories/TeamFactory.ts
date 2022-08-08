import Team from 'App/Models/Team'
import Factory from '@ioc:Adonis/Lucid/Factory'
import UserFactory from './UserFactory'

export default Factory.define(Team, ({ faker }) => {
    return {
      name: faker.random.words(3),
      notes: faker.company.catchPhraseDescriptor() 
    }
  })
  .relation('owner', () => UserFactory)
  .relation('teammateUsers', () => UserFactory)
  .build()
