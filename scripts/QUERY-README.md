# Query Bedrock Knowledge Base

Query your agricultural datasets using Amazon Bedrock Knowledge Base with AI-powered insights.

## Installation

```bash
cd scripts
npm install
```

This installs the Bedrock Agent Runtime SDK.

## Configuration

Your Knowledge Base ID is already configured: `ZQS6EKVSG7`

Set your AWS credentials (same as before):
```bash
export AWS_REGION="us-east-1"
export AWS_ACCESS_KEY_ID="your-key"
export AWS_SECRET_ACCESS_KEY="your-secret"
```

## Usage

### 1. Single Query

Ask a single question:
```bash
node query-knowledge-base.js "What soil data do we have?"
```

### 2. Interactive Mode

Ask multiple questions in a conversation:
```bash
node query-knowledge-base.js --interactive
```

Then type your questions:
```
Your question: What are the pH levels?
Your question: Show me water quality data
Your question: exit
```

### 3. Run Examples

Test with pre-defined example queries:
```bash
node query-knowledge-base.js --examples
```

## Example Queries

Try these questions:

**General:**
- "What data do we have?"
- "Summarize the agricultural datasets"

**Soil Data:**
- "What soil types are in the dataset?"
- "Show me soil pH information"
- "What are the soil characteristics?"

**Water Quality:**
- "What water quality parameters do we have?"
- "Show me TDS values"
- "What is the water table information?"

**Crop Recommendations:**
- "What crops are suitable for pH 7 soil?"
- "Recommend crops for loamy soil"
- "What fertilizers are needed for low nitrogen soil?"

## Response Format

The script returns:
1. **Answer** - AI-generated response based on your data
2. **Sources** - Citations showing which CSV files were used
3. **Excerpts** - Relevant snippets from your datasets

Example output:
```
🔍 Query: "What soil data do we have?"

⏳ Searching knowledge base...

✅ Answer:

Based on the agricultural datasets, we have soil information including:
- Soil pH levels ranging from 5.5 to 8.2
- Soil types: clay, loamy, sandy, silty
- Mineral content: nitrogen, phosphorus, potassium
- Organic carbon percentages
- District-level soil characteristics

---

📚 Sources:

1. Retrieved from:
   - s3://agritech-datasets/agricultural-data/soil.csv
     Excerpt: "district,soil_type,ph_level,nitrogen_ppm,phosphorus_ppm..."
```

## Integration with Your App

Use this in your AgriTech platform:

```javascript
const { queryKnowledgeBase } = require('./query-knowledge-base');

// In your API endpoint
app.post('/api/recommendations', async (req, res) => {
  const { farmerInput } = req.body;
  
  const question = `Based on soil pH ${farmerInput.phLevel}, 
    TDS ${farmerInput.tdsValue}, and soil type ${farmerInput.soilType}, 
    what crops are most suitable?`;
  
  const response = await queryKnowledgeBase(question);
  
  res.json({
    recommendation: response.output.text,
    sources: response.citations
  });
});
```

## Cost Estimate

**Per Query:**
- Bedrock model invocation: ~$0.003 per query (Claude 3 Sonnet)
- Knowledge Base retrieval: ~$0.0001 per query
- **Total: ~$0.003 per query**

**Monthly estimates:**
- 1,000 queries: ~$3
- 10,000 queries: ~$30
- 100,000 queries: ~$300

## Troubleshooting

### Error: "AccessDeniedException"
**Solution:** Add Bedrock permissions to your IAM user:
```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "bedrock:InvokeModel",
        "bedrock:Retrieve",
        "bedrock:RetrieveAndGenerate"
      ],
      "Resource": "*"
    }
  ]
}
```

### Error: "ResourceNotFoundException"
**Solution:** Verify your Knowledge Base ID:
```bash
export KNOWLEDGE_BASE_ID="ZQS6EKVSG7"
```

### Error: "ValidationException"
**Solution:** Ensure your Knowledge Base is synced and available in the Bedrock console.

### No results returned
**Solution:** 
- Check that your CSV files have data
- Try more specific questions
- Verify the sync completed successfully

## Advanced Configuration

### Use a Different Model

Edit `query-knowledge-base.js` line 17:

```javascript
// Use Claude 3 Haiku (faster, cheaper)
modelArn: 'arn:aws:bedrock:us-east-1::foundation-model/anthropic.claude-3-haiku-20240307-v1:0',

// Use Claude 3 Opus (more powerful, expensive)
modelArn: 'arn:aws:bedrock:us-east-1::foundation-model/anthropic.claude-3-opus-20240229-v1:0',
```

### Custom Knowledge Base ID

```bash
export KNOWLEDGE_BASE_ID="your-kb-id"
node query-knowledge-base.js "Your question"
```

## Next Steps

1. **Test queries** - Try different questions to see what insights you get
2. **Integrate into your app** - Use the query function in your API
3. **Add more data** - Upload more CSV files to improve recommendations
4. **Monitor costs** - Track usage in AWS Cost Explorer

## Support

For issues:
- [Bedrock Documentation](https://docs.aws.amazon.com/bedrock/)
- [Knowledge Bases Guide](https://docs.aws.amazon.com/bedrock/latest/userguide/knowledge-base.html)
