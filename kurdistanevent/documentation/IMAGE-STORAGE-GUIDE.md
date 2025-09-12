# Image Storage & Upload Guide

## Introduction

This document provides the technical plan for handling user-uploaded event images. Storing images directly on the backend server is not scalable or secure. Therefore, we will use a dedicated cloud storage service.

**Recommended Service:** **Amazon S3 (Simple Storage Service)** is the industry standard for object storage. It is highly scalable, durable, and cost-effective. The following guide will use AWS S3 as the example, but the principles apply to other services like Google Cloud Storage or Azure Blob Storage.

**Upload Strategy:** The frontend will send the image as a Base64-encoded string to our backend. The backend will then securely upload this image to the S3 bucket. This is a **mediated upload** strategy, which is more secure because it prevents exposing our cloud storage credentials directly to the client's browser.

---

## Phase 1: Cloud Service Setup (For the App Owner)

Your task is to create the S3 bucket and the secure credentials that your backend developer will need.

### Step-by-Step Checklist:

1.  **Create an AWS Account:** If you don't have one, sign up at [aws.amazon.com](https://aws.amazon.com/).

2.  **Create an S3 Bucket:**
    *   Navigate to the S3 service in the AWS Console.
    *   Click "Create bucket".
    *   **Bucket name:** Choose a globally unique name (e.g., `kurdistan-events-images-prod`).
    *   **AWS Region:** Choose a region geographically close to your users (e.g., `eu-central-1` for Europe/Middle East).
    *   **Block Public Access settings:** Keep the default setting: **"Block all public access"**. We will make individual images public, but the bucket itself should not be.
    *   Click "Create bucket".

3.  **Create a Secure IAM User:** We will create a special user that ONLY has permission to manage objects in this one bucket.
    *   Navigate to the IAM service.
    *   Go to "Users" and click "Add users".
    *   **User name:** Give it a descriptive name (e.g., `kurdistan-events-s3-uploader`).
    *   **Select AWS credential type:** Check **"Access key - Programmatic access"**. This is for application access only.
    *   Click "Next: Permissions".

4.  **Attach Security Policy:**
    *   Select "Attach existing policies directly".
    *   Click "Create policy". A new tab will open.
    *   In the policy editor, click the **JSON** tab and paste the following policy. **Remember to replace `YOUR-BUCKET-NAME-HERE` with the actual name of the bucket you created in Step 2.**

    ```json
    {
        "Version": "2012-10-17",
        "Statement": [
            {
                "Effect": "Allow",
                "Action": [
                    "s3:PutObject",
                    "s3:GetObject",
                    "s3:DeleteObject",
                    "s3:PutObjectAcl"
                ],
                "Resource": "arn:aws:s3:::YOUR-BUCKET-NAME-HERE/*"
            }
        ]
    }
    ```
    *   This policy grants the user permission to add, get, and delete objects *only* inside your specific bucket. This is a critical security practice known as the "Principle of Least Privilege."
    *   Click "Next: Tags", then "Next: Review". Give the policy a name (e.g., `KurdistanEventsS3AccessPolicy`) and click "Create policy".
    *   Go back to the user creation browser tab, refresh the list of policies, and select the one you just created.
    *   Click "Next: Tags", "Next: Review", and finally "Create user".

5.  **Get Your Secure Credentials:**
    *   On the final screen, you will see an **Access key ID** and a **Secret access key**.
    *   **This is the only time you will see the secret access key.** Copy both values and store them securely in a password manager.

6.  **Provide Credentials to Your Backend Developer:**
    You will need to provide the following four values to your backend developer. They will configure these as environment variables on the server.
    *   `AWS_ACCESS_KEY_ID` (from Step 5)
    *   `AWS_SECRET_ACCESS_KEY` (from Step 5)
    *   `AWS_S3_BUCKET_NAME` (the name of your bucket from Step 2)
    *   `AWS_REGION` (the region you chose in Step 2, e.g., `eu-central-1`)

---

## Phase 2: Backend Implementation (For the Backend Developer)

Your task is to implement the logic within the `POST /events` endpoint to handle the image data sent from the frontend.

### Workflow:

1.  **Receive the Request:** As per the `API-SPECIFICATION.md`, the request body for creating an event will contain an `image` field with a Base64 data URI (e.g., `data:image/jpeg;base64,/9j/4AAQSkZJRg...`).

2.  **Process the Image Data:**
    *   Parse the data URI to extract the mime type (e.g., `image/jpeg`) and the raw Base64 string.
    *   Convert the Base64 string into a binary buffer.

3.  **Upload to S3:**
    *   Use the AWS SDK for your chosen language (e.g., `aws-sdk` for Node.js, `boto3` for Python).
    *   Generate a unique file name for the image to prevent conflicts (e.g., using `uuid` or a timestamp + event ID).
    *   Create the parameters for the S3 `putObject` command:
        *   `Bucket`: The bucket name from the environment variable.
        *   `Key`: The unique file name you generated.
        *   `Body`: The binary buffer of the image.
        *   `ContentType`: The mime type extracted from the data URI.
        *   `ACL`: `'public-read'`. This makes the uploaded image publicly viewable via its URL.
    *   Execute the upload command.

4.  **Store the URL:**
    *   Upon successful upload, the AWS SDK will provide a URL to the object (e.g., `https://your-bucket-name.s3.your-region.amazonaws.com/your-unique-filename.jpg`).
    *   Save this URL to the `image_url` column in your `events` table in the PostgreSQL database.

### Pseudocode for Backend (`POST /events`):

```javascript
// Example using Node.js and the AWS SDK v3
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { v4 as uuidv4 } from 'uuid';

const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  }
});

async function createEvent(request, response) {
  const { image, ...eventData } = request.body;

  // 1. Decode Base64 image
  const base64Data = image.replace(/^data:image\/\w+;base64,/, "");
  const imageBuffer = Buffer.from(base64Data, 'base64');
  const mimeType = image.match(/data:(.*);base64/)[1];

  // 2. Generate unique filename
  const fileExtension = mimeType.split('/')[1]; // e.g., 'jpeg'
  const uniqueFilename = `${uuidv4()}.${fileExtension}`;

  // 3. Prepare S3 upload command
  const uploadParams = {
    Bucket: process.env.AWS_S3_BUCKET_NAME,
    Key: uniqueFilename,
    Body: imageBuffer,
    ContentType: mimeType,
    ACL: 'public-read' // Make the file publicly readable
  };

  try {
    await s3Client.send(new PutObjectCommand(uploadParams));

    // 4. Construct the public URL
    const imageUrl = `https://${process.env.AWS_S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${uniqueFilename}`;

    // 5. Save the event to the database with the imageUrl
    const newEvent = await database.events.create({
      ...eventData,
      image_url: imageUrl, // Store the S3 URL, not the Base64 data
      creator_id: request.user.id
    });

    return response.status(201).json({ event: newEvent });

  } catch (error) {
    console.error("Failed to upload image to S3:", error);
    return response.status(500).send("Error creating event.");
  }
}
```

---

## Phase 3: Frontend Configuration

**No changes are required on the frontend.**

The component at `src/pages/CreateEventPage.tsx` is already correctly configured to:
1.  Allow the user to select an image file from their device.
2.  Use the `FileReader` API to convert the image into a Base64 data URI.
3.  Place this data URI into the `image` field of the JSON payload sent to the `POST /events` endpoint.

This setup perfectly aligns with the backend implementation described above.
