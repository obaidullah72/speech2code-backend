const express = require('express');
const { exec } = require('child_process');
const util = require('util');
const cors = require('cors');
const { OpenAI } = require('openai');
require('dotenv').config();

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

const execPromise = util.promisify(exec);

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Voice-to-text endpoint (unchanged, echoes input for testing)
app.post('/api/voice-to-text', async (req, res) => {
  try {
    const { voiceInput } = req.body;
    if (!voiceInput) {
      throw new Error('No voice input provided');
    }
    const transcribedText = voiceInput;
    res.json({ 
      success: true,
      transcribedText,
      message: 'Voice successfully transcribed'
    });
  } catch (error) {
    console.error('Error in voice-to-text:', error);
    res.status(500).json({ 
      success: false,
      error: error.message 
    });
  }
});

// Text-to-code endpoint using OpenAI
app.post('/api/text-to-code', async (req, res) => {
  try {
    const { text } = req.body;
    if (!text) {
      throw new Error('No text input provided');
    }

    // Call OpenAI API to generate code
    const prompt = `Convert the following natural language description into Python code. Ensure the code is concise, well-commented, and executable. If the description is unclear, make reasonable assumptions and include comments explaining them. Description: "${text}"`;
    
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo', // or 'gpt-4' if available
      messages: [
        { role: 'system', content: 'You are a helpful coding assistant that generates accurate Python code.' },
        { role: 'user', content: prompt }
      ],
      max_tokens: 500,
      temperature: 0.5,
    });

    const generatedCode = completion.choices[0].message.content.trim();
    // Extract code from markdown code blocks if present
    const codeMatch = generatedCode.match(/```python\n([\s\S]*?)\n```/) || generatedCode.match(/```[\s\S]*?\n([\s\S]*?)\n```/) || [null, generatedCode];
    const code = codeMatch[1] || generatedCode;

    res.json({ 
      success: true,
      code,
      language: 'python',
      message: 'Code generated successfully'
    });
  } catch (error) {
    console.error('Error in text-to-code:', error);
    res.status(500).json({ 
      success: false,
      error: error.message 
    });
  }
});

// Execute code endpoint (unchanged, with added logging)
app.post('/api/execute-code', async (req, res) => {
  try {
    const { code } = req.body;
    if (!code) {
      throw new Error('No code provided');
    }
    
    // Basic security check
    if (code.includes('import os') || code.includes('import sys')) {
      throw new Error('Security restriction: Cannot import os or sys modules');
    }
    
    // Write code to a temporary file
    const fs = require('fs').promises;
    await fs.writeFile('temp.py', code);
    
    // Execute with resource limits
    const { stdout, stderr } = await execPromise('python temp.py', {
      timeout: 5000,
      maxBuffer: 1024 * 1024,
    });
    
    // Clean up
    await fs.unlink('temp.py');
    
    res.json({ 
      success: true,
      output: stdout || stderr,
      message: 'Code executed successfully'
    });
  } catch (error) {
    console.error('Error in execute-code:', error);
    res.status(500).json({ 
      success: false,
      error: error.message.includes('timed out') 
        ? 'Execution timed out (max 5 seconds)' 
        : error.message 
    });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});