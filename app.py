import os
import io

import streamlit as st
from dotenv import load_dotenv
from openai import OpenAI
from pypdf import PdfReader

load_dotenv()

st.set_page_config(page_title="StudyNotes AI", page_icon="📚", layout="wide")

st.markdown("""
<style>
    .main {background: #f7f8fc;}
    .hero {padding: 1.5rem 1.8rem; border-radius: 18px; background: linear-gradient(120deg,#172554,#4338ca); color: white; margin-bottom: 1.2rem;}
    .hero h1 {color:white; margin:0; font-size:2.2rem;}
    .hero p {color:#e0e7ff; margin:.5rem 0 0 0;}
    .stTabs [data-baseweb="tab-list"] {gap: 8px;}
    .stTabs [data-baseweb="tab"] {border-radius: 10px 10px 0 0;}
</style>
""", unsafe_allow_html=True)

st.markdown(
    '<div class="hero"><h1>📚 StudyNotes AI</h1><p>Turn lecture notes and PDFs into clear study material, flashcards, and practice quizzes.</p></div>',
    unsafe_allow_html=True,
)

with st.sidebar:
    st.header("⚙️ Settings")
    model = st.selectbox("AI model", ["gpt-4o-mini", "gpt-4o"], index=0)
    api_key_input = st.text_input(
        "OpenAI API key",
        type="password",
        help="Optional if OPENAI_API_KEY is set in your .env file.",
    )
    st.caption("Your API key is used only for the current session and is not saved by this app.")
    st.divider()
    st.markdown(
        "**How it works**\n1. Upload a PDF or paste text.\n2. Choose what to generate.\n3. Review and download your study pack."
    )

api_key = api_key_input.strip() or os.getenv("OPENAI_API_KEY", "")


def extract_pdf(uploaded_file) -> str:
    """Extract selectable text from every page in an uploaded PDF."""
    reader = PdfReader(io.BytesIO(uploaded_file.getvalue()))
    pages = [page.extract_text() or "" for page in reader.pages]
    return "\n\n".join(pages).strip()


def call_ai(source: str, task: str, level: str, extra: str = "") -> str:
    """Generate a study resource from source material with the OpenAI API."""
    if not api_key:
        raise RuntimeError(
            "Add your OpenAI API key in the sidebar or set OPENAI_API_KEY in your .env file."
        )

    if len(source) > 60000:
        source = source[:60000] + "\n\n[Input truncated to fit the app's safe processing limit.]"

    client = OpenAI(api_key=api_key)
    system = (
        "You are an expert academic tutor. Create accurate, well-organized study material "
        "from the supplied source. Do not invent facts that are not supported by the source. "
        "If something is unclear, say so. Use Markdown headings, concise explanations, "
        "and useful examples."
    )
    prompt = f"""Create the following study resource: {task}
Student level: {level}
Additional instructions: {extra or 'None'}

SOURCE MATERIAL:
{source}
"""

    response = client.chat.completions.create(
        model=model,
        messages=[
            {"role": "system", "content": system},
            {"role": "user", "content": prompt},
        ],
        temperature=0.3,
    )
    return response.choices[0].message.content or "No content was returned."


source_tab, paste_tab = st.tabs(["📄 Upload a PDF", "✍️ Paste text"])

with source_tab:
    uploaded = st.file_uploader(
        "Choose a PDF file",
        type=["pdf"],
        help="Text-based PDFs work best. Scanned PDFs require OCR, which is not included yet.",
    )
    extracted = ""
    if uploaded:
        try:
            extracted = extract_pdf(uploaded)
            if extracted:
                st.success(f"Extracted {len(extracted):,} characters from {uploaded.name}.")
            else:
                st.warning("No selectable text was found. This may be a scanned PDF; OCR is not included.")
        except Exception as exc:
            st.error(f"Could not read this PDF: {exc}")

with paste_tab:
    pasted = st.text_area(
        "Paste your lecture notes, textbook extract, or article",
        height=220,
        placeholder="Paste your study material here...",
    )

source = pasted.strip() if pasted.strip() else extracted

st.divider()
left, right = st.columns([2, 1])

with left:
    task = st.selectbox(
        "What would you like to generate?",
        [
            "Comprehensive study notes",
            "Quick revision summary",
            "Important questions and answers",
            "Flashcards (question and answer pairs)",
            "Multiple-choice practice quiz with answer key",
            "Key terms and definitions",
            "Complete study pack (notes, flashcards, and quiz)",
        ],
    )

with right:
    level = st.selectbox(
        "Learning level",
        ["Beginner", "Intermediate", "Advanced", "Exam preparation"],
        index=1,
    )

extra = st.text_input(
    "Optional focus (e.g. 'focus on SQL joins' or 'include simple examples')"
)

if st.button(
    "✨ Generate study material",
    type="primary",
    use_container_width=True,
    disabled=not bool(source.strip()),
):
    if len(source.strip()) < 80:
        st.warning("Please provide a little more source material (at least 80 characters).")
    else:
        with st.spinner("Building your study material..."):
            try:
                result = call_ai(source, task, level, extra)
                st.session_state["generated_result"] = result
                st.session_state["generated_task"] = task
            except Exception as exc:
                st.error(f"Could not generate study material: {exc}")

if st.session_state.get("generated_result"):
    st.divider()
    st.subheader(f"Your {st.session_state.get('generated_task', 'study material')}")
    result = st.session_state["generated_result"]
    st.markdown(result)
    st.download_button(
        "⬇️ Download as Markdown",
        data=result,
        file_name="study-notes.md",
        mime="text/markdown",
        use_container_width=True,
    )
    st.download_button(
        "⬇️ Download as text",
        data=result,
        file_name="study-notes.txt",
        mime="text/plain",
        use_container_width=True,
    )

with st.expander("🔒 Privacy and limitations"):
    st.write(
        "The app sends the text you provide to the OpenAI API when you generate content. "
        "Avoid uploading confidential or sensitive documents. PDF text extraction does not "
        "perform OCR on scanned pages. Always verify generated notes against your original material."
    )

st.caption("Built with Python, Streamlit, pypdf, and the OpenAI API · StudyNotes AI")
