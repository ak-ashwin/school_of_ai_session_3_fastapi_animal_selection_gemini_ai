# Animal Selector & File Upload App with Gemini AI

A modern web application built with FastAPI backend and HTML/CSS/JS frontend that allows users to:
1. Select animals (cat, dog, elephant) and view their images
2. Upload files and view their metadata (name, size, type)
3. **NEW**: Get interesting AI-generated facts about selected animals using Google Gemini
4. **NEW**: Analyze uploaded images with detailed descriptions using Gemini Vision

## Features

- **Animal Selection**: Choose from cat, dog, or elephant with visual feedback
- **Image Display**: Shows corresponding animal images when selected
- **AI Animal Facts**: Get fascinating facts about selected animals powered by Google Gemini
- **File Upload**: Drag-and-drop or click to upload any file
- **File Metadata**: Displays uploaded file's name, size, and type
- **AI Image Analysis**: Upload any image and get detailed AI-powered analysis using Gemini Vision
- **Modern UI**: Beautiful gradient background with hover effects
- **Responsive Design**: Works on both desktop and mobile devices

## Project Structure

```
session_2/
├── main.py                 # FastAPI backend
├── static/
│   ├── index.html         # Main HTML page
│   ├── style.css          # CSS styling
│   ├── script.js          # JavaScript functionality
│   └── images/
│       ├── cat.jpg        # Cat image
│       ├── dog.jpg        # Dog image
│       └── elephant.jpg   # Elephant image
├── pyproject.toml         # Project dependencies
└── README.md              # This file
```

## Installation & Setup

1. **Create virtual environment**:
   ```bash
   uv venv .venv
   source .venv/bin/activate
   ```

2. **Install dependencies**:
   ```bash
   uv sync
   ```

3. **Configure Gemini AI** (Optional - for AI features):
   - Get your free API key from [Google AI Studio](https://makersuite.google.com/app/apikey)
   - Create a `.env` file in the project root:
     ```bash
     echo "GEMINI_API_KEY=your_api_key_here" > .env
     ```
   - Replace `your_api_key_here` with your actual API key
   - **Note**: Without the API key, the app will work but AI features will be disabled

4. **Run the application**:
   ```bash
   python main.py
   ```

5. **Access the app**:
   Open your browser and go to `http://localhost:8000`

## Usage

### Animal Selection
1. Choose one of the three animals: Cat 🐱, Dog 🐶, or Elephant 🐘
2. Click "Show Animal" to display the corresponding image
3. Only one animal can be selected at a time

### File Upload
1. Click "Choose a file" or drag and drop a file into the upload area
2. Click "Upload File" to process the file
3. View the file's metadata including name, size, and type

## API Endpoints

- `GET /` - Serves the main HTML page
- `POST /select-animal` - Handles animal selection
- `POST /animal-info` - **NEW**: Get AI-generated facts about selected animals
- `POST /upload-file` - Handles file uploads
- `POST /analyze-image` - **NEW**: Analyze uploaded images with Gemini Vision
- `GET /static/{filename}` - Serves static files (CSS, JS, images)

## Technologies Used

- **Backend**: FastAPI, Uvicorn
- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **AI Integration**: Google Generative AI (Gemini)
- **Image Processing**: Pillow (PIL)
- **Environment Management**: python-dotenv
- **Package Management**: uv

## Development

The application uses a virtual environment and is configured to run on `http://localhost:8000` by default. All static files are served from the `/static` directory.

## Notes

- Animal images are placeholder images created programmatically
- File uploads are processed in memory (not saved to disk)
- The application supports all common file types
- Responsive design adapts to different screen sizes
