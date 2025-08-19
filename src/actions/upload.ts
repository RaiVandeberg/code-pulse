"use server"

import { checkRole } from "@/lib/clerk";
import { prisma } from "@/lib/prisma";
import { UpdateCourseFormData, updateCourseSchema } from "@/server/schemas/course";
import { S3Client, PutObjectCommand, DeleteObjectCommand, } from "@aws-sdk/client-s3"
import { createId } from "@paralleldrive/cuid2";
import slugify from "slugify";

const CLOUDFLARE_ACCOUNT_ID = process.env.CLOUDFLARE_ACCOUNT_ID;
const CLOUDFLARE_ACCESS_ID = process.env.CLOUDFLARE_ACCESS_ID;
const CLOUDFLARE_ACCESS_KEY = process.env.CLOUDFLARE_ACCESS_KEY;
const CLOUDFLARE_R2_BUCKET_NAME = process.env.CLOUDFLARE_R2_BUCKET_NAME;
const CLOUDFLARE_FILE_BASE_PATH = process.env.CLOUDFLARE_FILE_BASE_PATH;

if (!CLOUDFLARE_ACCOUNT_ID || !CLOUDFLARE_ACCESS_ID || !CLOUDFLARE_ACCESS_KEY || !CLOUDFLARE_R2_BUCKET_NAME || !CLOUDFLARE_FILE_BASE_PATH) {
    throw new Error("Missing Cloudflare R2 environment variables");
}


const S3 = new S3Client({
    region: "auto",
    endpoint: `https://${CLOUDFLARE_ACCOUNT_ID}.r2.cloudflarestorage.com`,
    credentials: {
        accessKeyId: CLOUDFLARE_ACCESS_ID,
        secretAccessKey: CLOUDFLARE_ACCESS_KEY,
    }
})

type UploadFileParams = {
    file: File;
    path: string;
}

export const uploadFile = async ({ file, path }: UploadFileParams) => {


    const fileName = file.name
    const fileId = createId();
    const size = file.size
    const fileType = file.type

    const fileMaxSize = 1024 * 1024 * 5

    if (size > fileMaxSize) {
        throw new Error("File size exceeds maximum limit");
    }

    const objetKey = `${path}/${fileId}-${fileName}`

    const cmd = new PutObjectCommand({
        Bucket: CLOUDFLARE_R2_BUCKET_NAME,
        Key: objetKey,
        ContentLength: size,
        ContentType: fileType,
        Body: Buffer.from(await file.arrayBuffer())
    })

    await S3.send(cmd)

    const fileUrl = `${CLOUDFLARE_FILE_BASE_PATH}/${objetKey}`

    return {
        url: fileUrl,
    }
}



export const deleteFile = async (url: string) => {
    const objectKey = url.split(`${CLOUDFLARE_FILE_BASE_PATH}/`)[1]

    const cmd = new DeleteObjectCommand({
        Bucket: CLOUDFLARE_R2_BUCKET_NAME,
        Key: objectKey
    })

    await S3.send(cmd)

}