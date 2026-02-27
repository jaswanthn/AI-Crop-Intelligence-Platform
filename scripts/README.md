# AWS S3 Dataset Upload Script

Upload agricultural CSV datasets to Amazon S3 for use with Amazon Bedrock Knowledge Base.

## Prerequisites

1. **Node.js** installed (v14 or higher)
2. **AWS Account** with S3 access
3. **AWS Credentials** configured

## Installation

```bash
# Navigate to the scripts folder
cd scripts

# Install dependencies
npm install
```

## AWS Credentials Setup

Choose one of these methods:

### Option 1: Environment Variables (Recommended for local testing)
```bash
export AWS_ACCESS_KEY_ID="your-access-key-id"
export AWS_SECRET_ACCESS_KEY="your-secret-access-key"
export AWS_REGION="ap-south-1"
```

### Option 2: AWS Credentials File (Recommended for development)
```bash
# Configure AWS CLI (this creates ~/.aws/credentials)
aws configure
```

### Option 3: IAM Role (Recommended for production on EC2/Lambda)
Attach an IAM role with S3 write permissions to your EC2 instance or Lambda function.

## Configuration

Set these environment variables before running:

```bash
# Required
export S3_BUCKET_NAME="your-bucket-name"

# Optional (defaults shown)
export AWS_REGION="ap-south-1"              # Mumbai region
export DATA_FOLDER="./data/csv-files"       # Local CSV folder
```

## Folder Structure

Create this folder structure:

```
scripts/
├── upload-datasets-to-s3.js
├── package.json
├── README.md
└── data/
    └── csv-files/
        ├── water-quality-data.csv
        ├── soil-mineral-content.csv
        └── district-soil-data.csv
```

## Usage

### Basic Usage
```bash
# Run the upload script
npm run upload

# Or directly with node
node upload-datasets-to-s3.js
```

### With Custom Configuration
```bash
# Upload from a different folder
DATA_FOLDER="./my-datasets" npm run upload

# Upload to a different bucket
S3_BUCKET_NAME="my-agritech-bucket" npm run upload

# Use a different AWS region
AWS_REGION="us-east-1" npm run upload
```

## Example CSV Files

Place your agricultural datasets in `data/csv-files/`:

- `water-quality-data.csv` - Water table levels, TDS values
- `soil-mineral-content.csv` - NPK, organic carbon, micronutrients
- `district-soil-data.csv` - Soil texture, drainage, erosion data

## S3 Bucket Setup

1. **Create S3 Bucket:**
```bash
aws s3 mb s3://agritech-datasets --region ap-south-1
```

2. **Set Bucket Policy** (for Bedrock Knowledge Base access):
```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "Service": "bedrock.amazonaws.com"
      },
      "Action": [
        "s3:GetObject",
        "s3:ListBucket"
      ],
      "Resource": [
        "arn:aws:s3:::agritech-datasets/*",
        "arn:aws:s3:::agritech-datasets"
      ]
    }
  ]
}
```

## IAM Permissions Required

Your AWS user/role needs these permissions:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "s3:PutObject",
        "s3:GetObject",
        "s3:ListBucket"
      ],
      "Resource": [
        "arn:aws:s3:::agritech-datasets/*",
        "arn:aws:s3:::agritech-datasets"
      ]
    }
  ]
}
```

## Troubleshooting

### Error: "Folder not found"
- Ensure `data/csv-files` folder exists
- Or set `DATA_FOLDER` to your CSV location

### Error: "Access Denied"
- Check AWS credentials are configured correctly
- Verify IAM permissions for S3 access
- Ensure bucket name is correct

### Error: "No such bucket"
- Create the S3 bucket first using AWS Console or CLI
- Verify bucket name matches `S3_BUCKET_NAME`

## Output

Successful upload shows:
```
🚀 Starting dataset upload to S3...

📁 Local folder: ./data/csv-files
☁️  S3 bucket: agritech-datasets
🌍 Region: ap-south-1

📊 Found 3 CSV file(s) to upload

✅ Uploaded: water-quality-data.csv → s3://agritech-datasets/agricultural-data/water-quality-data.csv
✅ Uploaded: soil-mineral-content.csv → s3://agritech-datasets/agricultural-data/soil-mineral-content.csv
✅ Uploaded: district-soil-data.csv → s3://agritech-datasets/agricultural-data/district-soil-data.csv

📈 Upload Summary:
   ✅ Successful: 3
   ❌ Failed: 0

✨ Upload process completed!
```

## Next Steps

After uploading datasets to S3:

1. **Create Bedrock Knowledge Base** in AWS Console
2. **Connect S3 bucket** as data source
3. **Configure embeddings model** (e.g., Titan Embeddings)
4. **Sync data** to create vector embeddings
5. **Query knowledge base** from your AgriTech platform

## Support

For issues or questions, refer to:
- [AWS SDK for JavaScript Documentation](https://docs.aws.amazon.com/sdk-for-javascript/)
- [Amazon Bedrock Knowledge Bases](https://docs.aws.amazon.com/bedrock/latest/userguide/knowledge-base.html)
