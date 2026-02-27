#!/usr/bin/env node

/**
 * Bedrock Knowledge Base Query Script for AgriTech Platform
 * 
 * This script queries the Amazon Bedrock Knowledge Base to retrieve
 * agricultural insights from your CSV datasets.
 * 
 * Usage: node query-knowledge-base.js "What soil data do we have?"
 */

const { BedrockAgentRuntimeClient, RetrieveAndGenerateCommand } = require('@aws-sdk/client-bedrock-agent-runtime');

// Configuration
const CONFIG = {
  region: process.env.AWS_REGION || 'us-east-1',
  knowledgeBaseId: process.env.KNOWLEDGE_BASE_ID || 'ZQS6EKVSG7',
  // Using Amazon Nova Lite (fast, cost-effective, auto-enabled)
  modelArn: 'arn:aws:bedrock:us-east-1::foundation-model/amazon.nova-lite-v1:0',
};

// Initialize Bedrock Agent Runtime Client
const bedrockClient = new BedrockAgentRuntimeClient({
  region: CONFIG.region,
});

/**
 * Query the Knowledge Base with a question
 */
async function queryKnowledgeBase(question) {
  try {
    console.log(`\n🔍 Query: "${question}"\n`);
    console.log('⏳ Searching knowledge base...\n');

    const command = new RetrieveAndGenerateCommand({
      input: {
        text: question,
      },
      retrieveAndGenerateConfiguration: {
        type: 'KNOWLEDGE_BASE',
        knowledgeBaseConfiguration: {
          knowledgeBaseId: CONFIG.knowledgeBaseId,
          modelArn: CONFIG.modelArn,
        },
      },
    });

    const response = await bedrockClient.send(command);

    // Display the answer
    console.log('✅ Answer:\n');
    console.log(response.output.text);
    console.log('\n---\n');

    // Display source citations
    if (response.citations && response.citations.length > 0) {
      console.log('📚 Sources:');
      response.citations.forEach((citation, index) => {
        console.log(`\n${index + 1}. Retrieved from:`);
        citation.retrievedReferences.forEach((ref) => {
          console.log(`   - ${ref.location.s3Location.uri}`);
          if (ref.content && ref.content.text) {
            console.log(`     Excerpt: "${ref.content.text.substring(0, 150)}..."`);
          }
        });
      });
    }

    return response;
  } catch (error) {
    console.error('❌ Error querying knowledge base:', error.message);
    
    if (error.name === 'ValidationException') {
      console.error('\n💡 Tip: Make sure your Knowledge Base is synced and available.');
    } else if (error.name === 'AccessDeniedException') {
      console.error('\n💡 Tip: Check your IAM permissions for Bedrock access.');
    } else if (error.name === 'ResourceNotFoundException') {
      console.error('\n💡 Tip: Verify your Knowledge Base ID is correct.');
    }
    
    throw error;
  }
}

/**
 * Interactive mode - ask multiple questions
 */
async function interactiveMode() {
  const readline = require('readline');
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  console.log('🌾 AgriTech Knowledge Base - Interactive Mode');
  console.log('Type your questions or "exit" to quit\n');

  const askQuestion = () => {
    rl.question('Your question: ', async (question) => {
      if (question.toLowerCase() === 'exit') {
        console.log('\n👋 Goodbye!');
        rl.close();
        return;
      }

      if (question.trim()) {
        try {
          await queryKnowledgeBase(question);
        } catch (error) {
          // Error already logged
        }
      }

      askQuestion();
    });
  };

  askQuestion();
}

/**
 * Example queries for testing
 */
async function runExamples() {
  console.log('🌾 Running example queries...\n');

  const examples = [
    'What soil data do we have?',
    'Show me information about pH levels',
    'What are the water quality parameters?',
  ];

  for (const question of examples) {
    try {
      await queryKnowledgeBase(question);
      await new Promise(resolve => setTimeout(resolve, 2000)); // Wait 2s between queries
    } catch (error) {
      console.error(`Failed to process: ${question}\n`);
    }
  }
}

// Main execution
if (require.main === module) {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    // No arguments - show usage and run interactive mode
    console.log('Usage:');
    console.log('  node query-knowledge-base.js "Your question here"');
    console.log('  node query-knowledge-base.js --interactive');
    console.log('  node query-knowledge-base.js --examples\n');
    
    interactiveMode();
  } else if (args[0] === '--interactive' || args[0] === '-i') {
    interactiveMode();
  } else if (args[0] === '--examples' || args[0] === '-e') {
    runExamples();
  } else {
    // Single query mode
    const question = args.join(' ');
    queryKnowledgeBase(question)
      .then(() => process.exit(0))
      .catch(() => process.exit(1));
  }
}

module.exports = { queryKnowledgeBase };
