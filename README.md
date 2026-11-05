# StudyNotes AI — AI-Powered Study Notes Generator

StudyNotes AI is a Streamlit web app that turns lecture material and text-based PDF documents into structured study resources using the OpenAI API.

## Features

- Upload a text-based PDF or paste study material directly.
- Generate comprehensive notes, quick revision summaries, question-and-answer sets, flashcards, MCQ quizzes, key terms, or a complete study pack.
- Choose a learning level: beginner, intermediate, advanced, or exam preparation.
- Add a custom focus to guide the generated material.
- Download generated material as Markdown or plain text.
- Supply the API key through the sidebar or an environment variable; secrets are excluded from Git.

## Tech stack

- Python
- Streamlit
- OpenAI API
- pypdf
- python-dotenv

## Run locally

### 1. Clone the repository

```bash
git clone https://github.com/david-8188/ai-powered-study-notes-generator.git
cd ai-powered-study-notes-generator
```

### 2. Create and activate a virtual environment

```bash
python -m venv .venv
```

Windows PowerShell:

```powershell
.venv\Scripts\Activate.ps1
```

macOS/Linux:

```bash
source .venv/bin/activate
```

### 3. Install dependencies

```bash
pip install -r requirements.txt
```

### 4. Configure your OpenAI API key

Copy `.env.example` to `.env` and replace the placeholder value:

```env
OPENAI_API_KEY=your_actual_api_key
```

You can also enter the key in the app's sidebar. Never commit your real API key or the `.env` file.

### 5. Run the app

```bash
streamlit run app.py
```

Open the local URL shown in the terminal (normally http://localhost:8501).

## Deploy with Streamlit Community Cloud

1. Sign in to [Streamlit Community Cloud](https://share.streamlit.io/).
2. Create an app using this repository, the `main` branch, and `app.py`.
3. In the app settings, add this secret:

```toml
OPENAI_API_KEY = "your_actual_api_key"
```

4. Deploy the app.

## Project structure

```text
.
├── app.py
├── requirements.txt
├── .env.example
├── .gitignore
├── LICENSE
└── README.md
```

## Notes and limitations

- PDF extraction supports text-based PDFs. Scanned PDFs need OCR, which is not included.
- Long source text is truncated to a maximum of 60,000 characters before being sent to the model.
- Source material is sent to the OpenAI API when you generate content. Do not upload confidential information.
- Generated study material may contain errors; verify important details against the original source.
- API usage may incur charges under your OpenAI account.

## Resume description

**AI-Powered Study Notes Generator | Python, Streamlit, OpenAI API, PyPDF**

Developed an AI-powered web application that extracts text from PDF documents and transforms learning material into structured notes, summaries, flashcards, key-term explanations, and MCQ quizzes. Integrated the OpenAI API for content generation and implemented downloadable study resources with environment-based API key management.

## License

This project is licensed under the MIT License. See [LICENSE](LICENSE).
