# 🗣️ speech2code-backend

A Node.js backend that enables **voice-to-code conversion** using OpenAI's GPT model. The server accepts spoken commands, converts them to text, generates Python code based on the input, and optionally executes the generated code securely.

---

## 🚀 Features

- 🎙️ **Voice-to-Text Endpoint** — Accepts transcribed speech input.
- 🧠 **Text-to-Code Conversion** — Converts natural language instructions into executable Python code using OpenAI's GPT API.
- 🧪 **Code Execution** — Runs the generated code in a secure, sandboxed environment with timeout and import restrictions.

---

## 📦 Tech Stack

- Node.js
- Express.js
- OpenAI API (GPT-3.5/GPT-4)
- Python (for code execution)
- CORS
- dotenv

---

## 🔧 Installation

```bash
# Clone the repository
git clone https://github.com/obaidullah72/speech2code-backend.git
cd speech2code-backend

# Install dependencies
npm install

# Create a .env file with your OpenAI API key
echo "OPENAI_API_KEY=your_openai_api_key" > .env
```

---

## 🛠️ API Endpoints

### 1. **POST /api/voice-to-text**

Receives voice input (text) and returns it (placeholder logic for testing).

**Request:**
```json
{
  "voiceInput": "Create a function to add two numbers"
}
```

**Response:**
```json
{
  "success": true,
  "transcribedText": "Create a function to add two numbers",
  "message": "Voice successfully transcribed"
}
```

---

### 2. **POST /api/text-to-code**

Converts a text instruction into Python code using OpenAI.

**Request:**
```json
{
  "text": "Create a function to add two numbers"
}
```

**Response:**
```json
{
  "success": true,
  "code": "def add_numbers(a, b):\n    return a + b",
  "language": "python",
  "message": "Code generated successfully"
}
```

---

### 3. **POST /api/execute-code**

Executes the Python code in a sandboxed environment and returns the output.

**Request:**
```json
{
  "code": "print('Hello, World!')"
}
```

**Response:**
```json
{
  "success": true,
  "output": "Hello, World!\n",
  "message": "Code executed successfully"
}
```

---

## ⚠️ Security Considerations

- Blocks code containing `import os` or `import sys`.
- Execution is limited to 5 seconds.
- Cleans up temporary files after execution.

---

## 🧪 Run Locally

```bash
# Start the server
node server.js
```

Visit: [http://localhost:3000](http://localhost:3000)

---

## 📄 License

MIT License

---

## 👨‍💻 Author

**Obaidullah** — [GitHub Profile](https://github.com/obaidullah72)