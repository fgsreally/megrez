import { MemoryVectorStore } from 'langchain/vectorstores/memory'
import { AttributeInfo } from 'langchain/schema/query_constructor'
import { Document } from 'langchain/document'
import { OpenAIEmbeddings } from 'langchain/embeddings/openai'
import { SelfQueryRetriever } from 'langchain/retrievers/self_query'
import { FunctionalTranslator } from 'langchain/retrievers/self_query/functional'
import { OpenAI } from 'langchain/llms/openai'
export class LangchainModule {
  vectorStore = new MemoryVectorStore(new OpenAIEmbeddings({}, {
    basePath: import.meta.env.OPENAI_PATH,
  }))

  llm = new OpenAI({}, {
    basePath: import.meta.env.OPENAI_PATH,
  })

  addDocument(docs: { pageContent: string; metadata: any }[]) {
    return this.vectorStore.addDocuments(docs.map(doc => new Document(doc)))
  }

  async selfQuery(query: string, attributeInfo: any) {
    const selfQueryRetriever = await SelfQueryRetriever.fromLLM({

      llm: this.llm,
      vectorStore: this.vectorStore,
      documentContents: 'Brief summary of a asset',
      attributeInfo,

      structuredQueryTranslator: new FunctionalTranslator(),
    })
    return selfQueryRetriever.getRelevantDocuments(query)
  }

  async conversation() {

  }
}
