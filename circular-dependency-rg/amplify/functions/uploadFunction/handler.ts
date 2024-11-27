import { Logger } from "@aws-lambda-powertools/logger";
import type { DynamoDBStreamHandler } from "aws-lambda";

const logger = new Logger({
  logLevel: "INFO",
  serviceName: "dynamodb-stream-handler",
});

export const handler: DynamoDBStreamHandler = async (event) => {
  for (const record of event.Records) {
    logger.info(`Processing record: ${record.eventID}`);
    logger.info(`Event Type: ${record.eventName}`);

    if (record.eventName === "INSERT") {
      // business logic to process new records
      logger.info(`New Image: ${JSON.stringify(record.dynamodb?.NewImage)}`);
    }
  }
  logger.info(`Successfully processed ${event.Records.length} records.`);

  return {
    batchItemFailures: [],
  };
};
