import {
  Button,
  Card,
  Flex,
  Heading,
  View,
  useTheme,
} from "@aws-amplify/ui-react";
import { Route, Routes, useNavigate } from "react-router-dom";
import "./App.css";
import RecipeGenerator from "./RecipeGenerator";
import Conversation from "./convo";

export default function App() {
  const { tokens } = useTheme();
  const navigate = useNavigate();

  return (
    <View className="ai-container">
      <Card variation="elevated">
        <Flex direction="column" gap={tokens.space.medium}>
          <Heading level={1}>AI Assistant Demo</Heading>

          <Flex
            direction="row"
            gap={tokens.space.small}
            justifyContent="center"
          >
            <Button
              variation="primary"
              onClick={() => navigate("/chat")}
              backgroundColor={tokens.colors.teal[60]}
            >
              Chat Assistant
            </Button>
            <Button
              variation="primary"
              onClick={() => navigate("/recipe")}
              backgroundColor={tokens.colors.teal[60]}
            >
              Recipe Generator
            </Button>
          </Flex>
        </Flex>
      </Card>

      <View marginTop={tokens.space.large}>
        <Routes>
          <Route path="/chat" element={<Conversation />} />
          <Route path="/recipe" element={<RecipeGenerator />} />
        </Routes>
      </View>
    </View>
  );
}
