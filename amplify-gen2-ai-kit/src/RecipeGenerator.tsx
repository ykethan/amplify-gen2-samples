import {
  Button,
  Card,
  Flex,
  Loader,
  TextAreaField,
  View,
  useTheme,
} from "@aws-amplify/ui-react";
import { useState } from "react";
import ReactMarkdown from "react-markdown";
import { useAIGeneration } from "./client";

export default function RecipeGenerator() {
  const [description, setDescription] = useState("");
  const [{ data, isLoading }, generateRecipe] =
    useAIGeneration("generateRecipe");
  const { tokens } = useTheme();

  const handleClick = async () => {
    generateRecipe({ description });
  };

  return (
    <Card variation="elevated">
      <div className="recipe-container">
        <Flex direction="column" gap={tokens.space.medium}>
          <Flex direction="column" gap={tokens.space.small}>
            <TextAreaField
              className="recipe-input"
              autoResize
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              label="Recipe Description"
              placeholder="Describe the recipe you'd like to generate..."
              maxHeight="200px"
            />
            <Button
              onClick={handleClick}
              isLoading={isLoading}
              backgroundColor={tokens.colors.teal[60]}
            >
              Generate Recipe
            </Button>
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
                <ReactMarkdown>{`## Instructions\n${data.instructions}`}</ReactMarkdown>
              )}
            </View>
          )}
        </Flex>
      </div>
    </Card>
  );
}
