import { OpenAI } from "langchain";
import { PromptTemplate } from "langchain/prompts";
import { ConversationChain, LLMChain } from "langchain/chains";
import { initializeAgentExecutor } from "langchain/agents";
import { SerpAPI, Calculator } from "langchain/tools";
import { BufferMemory } from "langchain/memory";

const model = new OpenAI({ temperature: 0.9 });
// await tryAgent();
await tryPromptTemplate();
await tryMemory();

async function tryMemory() {
    console.log("try memory: start");
    const memory = new BufferMemory();
    const chain = new ConversationChain({ llm: model, memory: memory });
    const res1 = await chain.call({ input: "Hi! I'm Jim." });
    console.log(res1);
    const res2 = await chain.call({ input: "What's my name?" });
    console.log(res2);
    console.log("try memory: end");
}

async function tryAgent() {
    console.log("try agent: start");

    const tools = [new SerpAPI(), new Calculator()];
    const executor = await initializeAgentExecutor(
        tools,
        model,
        "zero-shot-react-description"
    );
    console.log("Loaded agent.");

    const input = "Who is Olivia Wilde's boyfriend? What is his current age raised to the 0.23 power?";
    console.log(`Executing with input "${input}"...`);

    const result = await executor.call({ input });
    console.log(`Got output ${result.output}`);

    console.log("try agent: end");
}

async function tryPromptTemplate() {
    console.log("try prompt template: start");

    const template = "What is a good name for a company that makes {product}?";
    const prompt = new PromptTemplate({
        template: template,
        inputVariables: ["product"],
    });

    const chain = new LLMChain({ llm: model, prompt: prompt });

    const res = await chain.call({ product: "colorful socks" });
    console.log(res);

    console.log("try prompt template: end");
}

