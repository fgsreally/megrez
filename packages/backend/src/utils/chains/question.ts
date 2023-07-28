import { OpenAI } from 'langchain/llms'
import { ChatVectorDBQAChain, ConversationalRetrievalQAChain, LLMChain, loadQAChain } from 'langchain/chains'
import type { SupabaseVectorStore } from 'langchain/vectorstores'
import { HNSWLib } from 'langchain/vectorstores'
import { PromptTemplate } from 'langchain/prompts'
import type { MongoDBAtlasVectorSearch } from 'langchain/vectorstores/mongodb_atlas'
import { BufferMemory } from 'langchain/memory'
import { loadQAStuffChain, loadQAMapReduceChain } from "langchain/chains";

const CONDENSE_PROMPT
  = PromptTemplate.fromTemplate(`Given the following conversation and a follow up question, rephrase the follow up question to be a standalone question.

Chat History:
{chat_history}
Follow Up Input: {question}
Standalone question:`)

const QA_PROMPT = PromptTemplate.fromTemplate(
  `You are an AI assistant and a Notion expert. You are given the following extracted parts of a long document and a question. Provide a conversational answer based on the context provided.
You should only use hyperlinks as references that are explicitly listed as a source in the context below. Do NOT make up a hyperlink that is not listed below.
If you can't find the answer in the context below, just say "Hmm, I'm not sure." Don't try to make up an answer.
If the question is not related to Notion, notion api or the context provided, politely inform them that you are tuned to only answer questions that are related to Notion.
Choose the most relevant link that matches the context provided:

Question: {question}
=========
{context}
=========
Answer in Markdown:`,
)

export const makeChain = (
  vectorstore: MongoDBAtlasVectorSearch,
  onTokenStream?: (token: string) => void,
) => {
  const questionGenerator = new LLMChain({
    llm: new OpenAI({ temperature: 0 }),
    prompt: CONDENSE_PROMPT,
  })
  const docChain = loadQAChain(
    new OpenAI({
      temperature: 0,
      streaming: Boolean(onTokenStream),
      callbackManager: {
        handleNewToken: onTokenStream,
      },
    }),
    { prompt: QA_PROMPT },
  )

  const ret = ConversationalRetrievalQAChain.fromLLM(new OpenAI({ temperature: 0 }), vectorstore.asRetriever(), {
    memory: new BufferMemory({
      memoryKey: 'chat_history', // Must be set to "chat_history"
    }),
  })
  ret.call()
}
