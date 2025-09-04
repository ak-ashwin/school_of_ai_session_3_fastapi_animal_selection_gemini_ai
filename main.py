from fastapi import FastAPI, File, UploadFile, Form, HTTPException
from fastapi.responses import HTMLResponse, FileResponse
from fastapi.staticfiles import StaticFiles
import os
from pathlib import Path
import google.generativeai as genai
from dotenv import load_dotenv
import base64
from PIL import Image
import io
import logging

# Load environment variables
load_dotenv()

# Configure logging
logging.basicConfig(level=logging.INFO)

app = FastAPI(title="Animal Selector & File Upload App with Gemini AI")

# Configure Gemini AI
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
if GEMINI_API_KEY:
    genai.configure(api_key=GEMINI_API_KEY)
    gemini_model = genai.GenerativeModel('gemini-1.5-flash')
    gemini_vision_model = genai.GenerativeModel('gemini-1.5-flash')
    logging.info("Gemini AI configured successfully")
else:
    logging.warning("GEMINI_API_KEY not found. Gemini features will be disabled.")
    gemini_model = None
    gemini_vision_model = None

# Mount static files
app.mount("/static", StaticFiles(directory="static"), name="static")

@app.get("/", response_class=HTMLResponse)
async def read_root():
    """Serve the main HTML page"""
    return FileResponse("static/index.html")

@app.post("/analyze-image")
async def analyze_image(file: UploadFile = File(...)):
    """Analyze uploaded image using Gemini Vision"""
    if not gemini_vision_model:
        raise HTTPException(status_code=503, detail="Gemini AI is not configured. Please set GEMINI_API_KEY environment variable.")
    
    try:
        # Read and validate image file
        contents = await file.read()
        
        # Convert to PIL Image for processing
        image = Image.open(io.BytesIO(contents))
        
        # Convert to RGB if necessary
        if image.mode != 'RGB':
            image = image.convert('RGB')
        
        # Generate content with Gemini Vision
        prompt = """Analyze this image in detail. Describe:
        1. What you see in the image
        2. If there are any animals, identify them and provide interesting facts
        3. The overall composition, colors, and mood
        4. Any notable features or objects
        
        Keep your response informative but engaging, like you're describing it to a curious friend."""
        
        response = gemini_vision_model.generate_content([prompt, image])
        
        return {
            "success": True,
            "filename": file.filename,
            "analysis": response.text,
            "message": "Image analyzed successfully with Gemini AI!"
        }
        
    except Exception as e:
        logging.error(f"Error analyzing image: {str(e)}")
        return {
            "success": False,
            "message": f"Error analyzing image: {str(e)}"
        }

@app.post("/animal-info")
async def get_animal_info(animal: str = Form(...)):
    """Get interesting information about selected animal using Gemini"""
    if not gemini_model:
        raise HTTPException(status_code=503, detail="Gemini AI is not configured. Please set GEMINI_API_KEY environment variable.")
    
    try:
        prompt = f"""Tell me fascinating and fun facts about {animal}s. Include:
        1. 3-4 interesting behaviors or characteristics
        2. Amazing abilities or superpowers they have
        3. Fun facts that most people don't know
        4. Their role in the ecosystem
        
        Make it engaging and educational, suitable for all ages. Keep it concise but informative."""
        
        response = gemini_model.generate_content(prompt)
        
        return {
            "success": True,
            "animal": animal.lower(),
            "info": response.text,
            "message": f"Here's what Gemini AI knows about {animal}s!"
        }
        
    except Exception as e:
        logging.error(f"Error getting animal info: {str(e)}")
        return {
            "success": False,
            "message": f"Error getting animal information: {str(e)}"
        }

@app.post("/select-animal")
async def select_animal(animal: str = Form(...)):
    """Handle animal selection and return image path"""
    if animal.lower() in ["cat", "dog", "elephant"]:
        image_path = f"/static/images/{animal.lower()}.jpg"
        return {
            "success": True,
            "animal": animal.lower(),
            "image_path": image_path,
            "message": f"You selected a {animal.lower()}!"
        }
    else:
        return {
            "success": False,
            "message": "Invalid animal selection"
        }

@app.post("/upload-file")
async def upload_file(file: UploadFile = File(...)):
    """Handle file upload and return file metadata"""
    if file:
        file_size = 0
        # Read file to get size
        content = await file.read()
        file_size = len(content)
        
        # Reset file pointer for potential future use
        await file.seek(0)
        
        return {
            "success": True,
            "filename": file.filename,
            "file_size": file_size,
            "file_type": file.content_type,
            "message": f"File '{file.filename}' uploaded successfully!"
        }
    else:
        return {
            "success": False,
            "message": "No file uploaded"
        }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)