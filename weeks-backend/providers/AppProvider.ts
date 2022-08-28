import { ApplicationContract } from '@ioc:Adonis/Core/Application'
import { string } from '@ioc:Adonis/Core/Helpers'
import { SimplePaginatorMetaKeys } from '@ioc:Adonis/Lucid/Database'
import { LucidModel } from '@ioc:Adonis/Lucid/Orm'

export default class AppProvider {
  constructor(protected app: ApplicationContract) {}

  public register() {
    // Register your own bindings
  }

  public async boot() {
    // IoC container is ready
  }

  public async ready() {
    const Db = this.app.container.use('Adonis/Lucid/Database')
    const Orm = this.app.container.use('Adonis/Lucid/Orm')

    class CamelCaseNameStrategy extends Orm.SnakeCaseNamingStrategy {
      public tableName(model: LucidModel) {
        return string.pluralize(string.snakeCase(model.name))
      }

      public columnName(_model: LucidModel, attributeName: string): string {
        return string.camelCase(attributeName)
      }

      public serializedName(_model: LucidModel, attributeName: string): string {
        return string.camelCase(attributeName)
      }

      paginationMetaKeys(): SimplePaginatorMetaKeys {
        return {
          total: 'total',
          perPage: 'perPage',
          currentPage: 'currentPage',
          lastPage: 'lastPage',
          firstPage: 'firstPage',
          firstPageUrl: 'firstPageUrl',
          lastPageUrl: 'lastPageUrl',
          nextPageUrl: 'nextPageUrl',
          previousPageUrl: 'previousPageUrl',
        }
      }
    }
    
    // Orm.ModelPaginator.namingStrategy = new CamelCaseNameStrategy()
    // Orm.BaseModel.namingStrategy = new CamelCaseNameStrategy()
    Db.SimplePaginator.namingStrategy = new CamelCaseNameStrategy()
  }

  public async shutdown() {
    // Cleanup, since app is going down
  }
}
