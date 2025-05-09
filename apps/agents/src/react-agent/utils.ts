import { initChatModel } from "langchain/chat_models/universal";
import { type BaseMessage, HumanMessage } from "@langchain/core/messages";

/**
 * Load a chat model from a fully specified name.
 * @param fullySpecifiedName - String in the format 'provider/model' or 'provider/account/provider/model'.
 * @returns A Promise that resolves to a BaseChatModel instance.
 */
export async function loadChatModel(
  fullySpecifiedName: string
): Promise<ReturnType<typeof initChatModel>> {
  const index = fullySpecifiedName.indexOf("/");
  if (index === -1) {
    // If there's no "/", assume it's just the model
    return await initChatModel(fullySpecifiedName);
  } else {
    const provider = fullySpecifiedName.slice(0, index);
    const model = fullySpecifiedName.slice(index + 1);
    return await initChatModel(model, { modelProvider: provider });
  }
}

function constructWebViewPrompt(
  url: string,
  title: string,
  htmlContent: string
): string {
  return `
# Webview
* URL: ${url}
* Title: ${title}
* HTML: 
${htmlContent}
`;
}

export function messagesDecorator(messages: BaseMessage[]): BaseMessage[] {
  return messages.map((message) => {
    if (!(message instanceof HumanMessage)) {
      return message;
    }
    if (message.content instanceof Array) {
      const newContent = message.content.map((content) => {
        if (content.type === "webview") {
          return {
            type: "text",
            text: constructWebViewPrompt(
              content.url,
              content.title,
              content.htmlContent
            ),
          };
        }
        return content;
      });
      return new HumanMessage({ ...message, content: newContent });
    }
    return message;
  });
}
