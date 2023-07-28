import * as mongoose from 'mongoose'
import { MongoDBAtlasVectorSearch } from 'langchain/vectorstores/mongodb_atlas'
import {  OpenAIEmbeddings } from 'langchain/embeddings'
import { Document } from 'langchain/document'
export class LangchainService {
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
