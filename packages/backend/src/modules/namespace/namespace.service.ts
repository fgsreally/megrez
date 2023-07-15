import { Init, Inject } from 'phecda-server'
import * as mongoose from 'mongoose'
import { MongoDBAtlasVectorSearch } from 'langchain/vectorstores/mongodb_atlas'
import { Embeddings, OpenAIEmbeddings } from 'langchain/embeddings'
import { Document } from 'langchain/document'
import { NamespaceModel } from './namespace.model'

@Inject
export class NamespaceService {
  Model = NamespaceModel

  findNamespace(name: string) {
    return this.Model.find({ name })
  }

  async parseDataToDoc(data: any[]): Promise< Document[]> {
    return data.map((item: any) => new Document(item))
  }

  async addDocToVectorStore(collectionName: string, data: any[]) {
    const collection = mongoose.connection.collection(`lanchain:${collectionName}`)
    const vectorStore = new MongoDBAtlasVectorSearch(new OpenAIEmbeddings(), {
      collection,
    })

    await vectorStore.addDocuments(await this.parseDataToDoc(data))
  }
}
