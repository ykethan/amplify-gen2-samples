import {
  GetObjectCommand,
  HeadObjectCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import sharp from "sharp";

const s3Client = new S3Client();

export const handler = async (event: any) => {
  try {
    // Extract bucket and key from the event
    const bucket = event.Records[0].s3.bucket.name;
    const key = event.Records[0].s3.object.key;

    // Get the image from S3
    const getObjectParams = {
      Bucket: bucket,
      Key: key,
    };
    const { Body } = await s3Client.send(new GetObjectCommand(getObjectParams));

    // Check if the image is already optimized
    const { Metadata } = await s3Client.send(
      new HeadObjectCommand(getObjectParams)
    );
    if (Metadata && Metadata.optimized === "true") {
      console.log("Skipping already optimized image");
      return {
        statusCode: 200,
        body: JSON.stringify({ message: "Image already optimized" }),
      };
    }

    // Optimize the image
    const optimizedImage = await sharp(await Body?.transformToByteArray())
      .resize(800) // Resize to 800px width, maintaining aspect ratio
      .webp({ quality: 80 }) // Convert to WebP format with 80% quality
      .toBuffer();

    // Check if the key starts with 'optimized/'
    if (key.startsWith("optimized/")) {
      console.log("Skipping already optimized image");
      return {
        statusCode: 200,
        body: JSON.stringify({ message: "Image already optimized" }),
      };
    }

    // Upload the optimized image back to S3
    const optimizedKey = `optimized/${key}`;
    const putObjectParams = {
      Bucket: bucket,
      Key: optimizedKey,
      Body: optimizedImage,
      ContentType: "image/webp",
      Metadata: { optimized: "true" },
    };
    await s3Client.send(new PutObjectCommand(putObjectParams));

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "Image optimized successfully",
        optimizedKey,
      }),
    };
  } catch (error) {
    console.error("Error optimizing image:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: "Error optimizing image",
        error: error instanceof Error ? error.message : String(error),
      }),
    };
  }
};
