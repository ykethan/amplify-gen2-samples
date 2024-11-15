import {
  Button,
  Flex,
  Loader,
  TextAreaField,
  View,
} from "@aws-amplify/ui-react";
import "@aws-amplify/ui-react/styles.css";
import * as React from "react";
import ReactMarkdown from "react-markdown";
import { useAIGeneration } from "./client";

export default function App() {
  const [description, setDescription] = React.useState("");
  const [{ data, isLoading }, generateRecipe] =
    useAIGeneration("generateRecipe");

  const handleClick = async () => {
    generateRecipe({ description });
  };

  return (
    <Flex direction="column">
      <Flex direction="row">
        <TextAreaField
          autoResize
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          label="Description"
        />
        <Button onClick={handleClick}>Generate recipe</Button>
      </Flex>
      {isLoading ? (
        <Loader variation="linear" />
      ) : (
        <View className="recipe-content">
          {data?.name && <ReactMarkdown>{`# ${data.name}`}</ReactMarkdown>}
          {data?.ingredients && (
            <ReactMarkdown>
              {`## Ingredients\n${data.ingredients
                .map((ingredient) => `- ${ingredient}`)
                .join("\n")}`}
            </ReactMarkdown>
          )}
          {data?.instructions && (
            <ReactMarkdown>
              {`## Instructions\n${data.instructions}`}
            </ReactMarkdown>
          )}
        </View>
      )}
    </Flex>
  );
}
