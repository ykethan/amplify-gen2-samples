import { Card, View } from "@aws-amplify/ui-react";
import { AIConversation } from "@aws-amplify/ui-react-ai";
import { useAIConversation } from "./client";

export default function Conversation() {
  const [
    {
      data: { messages },
      isLoading,
    },
    handleSendMessage,
  ] = useAIConversation("chat");

  return (
    <Card variation="elevated">
      <View className="chat-container">
        <div className="chat-content">
          <AIConversation
            messages={messages}
            isLoading={isLoading}
            handleSendMessage={handleSendMessage}
          />
        </div>
      </View>
    </Card>
  );
}
