#!/usr/bin/env node

/**
 * AWS S3 Dataset Upload Script for AgriTech Platform
 * 
 * This script uploads agricultural CSV datasets (water quality, soil data, etc.)
 * from a local folder to an Amazon S3 bucket for use with Amazon Bedrock Knowledge Base.
 * 
 * Usage: node upload-datasets-to-s3.js
 */

const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
const fs = require('fs');
const path = require('path');

// Configuration
const CONFIG = {
  region: process.env.AWS_REGION || 'us-east-1', // US East (N. Virginia)
  bucketName: process.env.S3_BUCKET_NAME || 'agritech-datasets',
  localDataFolder: process.env.DATA_FOLDER || './data/csv-files',
  s3Prefix: 'agricultural-data/', // Folder structure in S3
};

// Initialize S3 Client with explicit configuration
const s3Client = new S3Client({
  region: CONFIG.region,
  forcePathStyle: false,
  // AWS SDK will automatically use credentials from:
  // 1. Environment variables (AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY)
  // 2. AWS credentials file (~/.aws/credentials)
  // 3. IAM role (if running on EC2/Lambda)
});

/**
 * Read all CSV files from the local folder
 */
function getCSVFiles(folderPath) {
  try {
    if (!fs.existsSync(folderPath)) {
      throw new Error(`Folder not found: ${folderPath}`);
    }

    const files = fs.readdirSync(folderPath);
    const csvFiles = files.filter(file => file.toLowerCase().endsWith('.csv'));

    if (csvFiles.length === 0) {
      console.warn(`⚠️  No CSV files found in ${folderPath}`);
    }

    return csvFiles;
  } catch (error) {
    console.error(`❌ Error reading folder: ${error.message}`);
    throw error;
  }
}

/**
 * Upload a single file to S3
 */
async function uploadFileToS3(filePath, fileName) {
  try {
    const fileContent = fs.readFileSync(filePath);
    const s3Key = `${CONFIG.s3Prefix}${fileName}`;

    const command = new PutObjectCommand({
      Bucket: CONFIG.bucketName,
      Key: s3Key,
      Body: fileContent,
      ContentType: 'text/csv',
      Metadata: {
        'upload-date': new Date().toISOString(),
        'source': 'agritech-platform',
      },
    });

    await s3Client.send(command);
    console.log(`✅ Uploaded: ${fileName} → s3://${CONFIG.bucketName}/${s3Key}`);
    return { success: true, fileName, s3Key };
  } catch (error) {
    console.error(`❌ Failed to upload ${fileName}: ${error.message}`);
    return { success: false, fileName, error: error.message };
  }
}

/**
 * Main function to upload all CSV files
 */
async function uploadAllDatasets() {
  console.log('🚀 Starting dataset upload to S3...\n');
  console.log(`📁 Local folder: ${CONFIG.localDataFolder}`);
  console.log(`☁️  S3 bucket: ${CONFIG.bucketName}`);
  console.log(`🌍 Region: ${CONFIG.region}\n`);

  try {
    // Get all CSV files
    const csvFiles = getCSVFiles(CONFIG.localDataFolder);
    console.log(`📊 Found ${csvFiles.length} CSV file(s) to upload\n`);

    if (csvFiles.length === 0) {
      return;
    }

    // Upload each file
    const results = [];
    for (const fileName of csvFiles) {
      const filePath = path.join(CONFIG.localDataFolder, fileName);
      const result = await uploadFileToS3(filePath, fileName);
      results.push(result);
    }

    // Summary
    const successful = results.filter(r => r.success).length;
    const failed = results.filter(r => !r.success).length;

    console.log('\n📈 Upload Summary:');
    console.log(`   ✅ Successful: ${successful}`);
    console.log(`   ❌ Failed: ${failed}`);

    if (failed > 0) {
      console.log('\n⚠️  Failed uploads:');
      results.filter(r => !r.success).forEach(r => {
        console.log(`   - ${r.fileName}: ${r.error}`);
      });
    }

    console.log('\n✨ Upload process completed!');
  } catch (error) {
    console.error(`\n❌ Fatal error: ${error.message}`);
    process.exit(1);
  }
}

// Run the script
if (require.main === module) {
  uploadAllDatasets();
}

module.exports = { uploadAllDatasets, uploadFileToS3 };
