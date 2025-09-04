// DOM elements
const animalForm = document.getElementById('animalForm');
const fileForm = document.getElementById('fileForm');
const animalCheckboxes = document.querySelectorAll('.animal-checkbox');
const fileInput = document.getElementById('fileInput');
const fileLabel = document.querySelector('.file-label');
const animalMessage = document.getElementById('animalMessage');
const fileMessage = document.getElementById('fileMessage');
const animalImage = document.getElementById('animalImage');
const fileInfo = document.getElementById('fileInfo');

// New AI elements
const getAnimalInfoBtn = document.getElementById('getAnimalInfoBtn');
const analyzeImageBtn = document.getElementById('analyzeImageBtn');
const animalAIInfo = document.getElementById('animalAIInfo');
const animalAIContent = document.getElementById('animalAIContent');
const imageAIAnalysis = document.getElementById('imageAIAnalysis');
const imageAIContent = document.getElementById('imageAIContent');

// Track current state
let currentAnimal = null;
let currentUploadedFile = null;

// Animal selection functionality
animalCheckboxes.forEach(checkbox => {
    checkbox.addEventListener('change', function() {
        // Only allow one checkbox to be selected at a time
        if (this.checked) {
            animalCheckboxes.forEach(cb => {
                if (cb !== this) {
                    cb.checked = false;
                    cb.parentElement.classList.remove('selected');
                }
            });
            this.parentElement.classList.add('selected');
        } else {
            this.parentElement.classList.remove('selected');
        }
    });
});

// Handle animal form submission
animalForm.addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const selectedAnimal = document.querySelector('.animal-checkbox:checked');
    if (!selectedAnimal) {
        showMessage(animalMessage, 'Please select an animal first!', 'error');
        return;
    }

    const formData = new FormData();
    formData.append('animal', selectedAnimal.value);

    try {
        showMessage(animalMessage, 'Loading...', 'info');
        
        const response = await fetch('/select-animal', {
            method: 'POST',
            body: formData
        });

        const result = await response.json();

        if (result.success) {
            showMessage(animalMessage, result.message, 'success');
            showAnimalImage(result.image_path, result.animal);
            currentAnimal = result.animal;
            getAnimalInfoBtn.style.display = 'inline-block';
        } else {
            showMessage(animalMessage, result.message, 'error');
            hideAnimalImage();
            currentAnimal = null;
            getAnimalInfoBtn.style.display = 'none';
        }
    } catch (error) {
        console.error('Error:', error);
        showMessage(animalMessage, 'An error occurred while selecting the animal.', 'error');
        hideAnimalImage();
    }
});

// File drag and drop functionality
fileLabel.addEventListener('dragover', function(e) {
    e.preventDefault();
    this.classList.add('drag-over');
});

fileLabel.addEventListener('dragleave', function(e) {
    e.preventDefault();
    this.classList.remove('drag-over');
});

fileLabel.addEventListener('drop', function(e) {
    e.preventDefault();
    this.classList.remove('drag-over');
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
        fileInput.files = files;
        updateFileLabel(files[0].name);
    }
});

// Update file label when file is selected
fileInput.addEventListener('change', function(e) {
    if (e.target.files.length > 0) {
        updateFileLabel(e.target.files[0].name);
    }
});

// Handle file form submission
fileForm.addEventListener('submit', async function(e) {
    e.preventDefault();
    
    if (!fileInput.files.length) {
        showMessage(fileMessage, 'Please select a file first!', 'error');
        return;
    }

    const formData = new FormData();
    formData.append('file', fileInput.files[0]);

    try {
        showMessage(fileMessage, 'Uploading...', 'info');
        
        const response = await fetch('/upload-file', {
            method: 'POST',
            body: formData
        });

        const result = await response.json();

        if (result.success) {
            showMessage(fileMessage, result.message, 'success');
            showFileInfo(result);
            currentUploadedFile = fileInput.files[0];
            // Show AI analyze button for image files
            if (currentUploadedFile && currentUploadedFile.type.startsWith('image/')) {
                analyzeImageBtn.style.display = 'inline-block';
            }
        } else {
            showMessage(fileMessage, result.message, 'error');
            hideFileInfo();
            currentUploadedFile = null;
            analyzeImageBtn.style.display = 'none';
        }
    } catch (error) {
        console.error('Error:', error);
        showMessage(fileMessage, 'An error occurred while uploading the file.', 'error');
        hideFileInfo();
    }
});

// AI Animal Info Button Handler
getAnimalInfoBtn.addEventListener('click', async function() {
    if (!currentAnimal) {
        showMessage(animalMessage, 'Please select an animal first!', 'error');
        return;
    }

    const formData = new FormData();
    formData.append('animal', currentAnimal);

    try {
        getAnimalInfoBtn.textContent = '🤖 Loading...';
        getAnimalInfoBtn.disabled = true;
        hideAIInfo(animalAIInfo);
        
        const response = await fetch('/animal-info', {
            method: 'POST',
            body: formData
        });

        const result = await response.json();

        if (result.success) {
            showAIInfo(animalAIInfo, animalAIContent, result.info, 'Animal Facts');
        } else {
            showMessage(animalMessage, result.message, 'error');
        }
    } catch (error) {
        console.error('Error:', error);
        showMessage(animalMessage, 'An error occurred while getting animal information.', 'error');
    } finally {
        getAnimalInfoBtn.textContent = '🤖 Get AI Facts';
        getAnimalInfoBtn.disabled = false;
    }
});

// AI Image Analysis Button Handler
analyzeImageBtn.addEventListener('click', async function() {
    if (!currentUploadedFile) {
        showMessage(fileMessage, 'Please upload an image first!', 'error');
        return;
    }

    const formData = new FormData();
    formData.append('file', currentUploadedFile);

    try {
        analyzeImageBtn.textContent = '🤖 Analyzing...';
        analyzeImageBtn.disabled = true;
        hideAIInfo(imageAIAnalysis);
        
        const response = await fetch('/analyze-image', {
            method: 'POST',
            body: formData
        });

        const result = await response.json();

        if (result.success) {
            showAIInfo(imageAIAnalysis, imageAIContent, result.analysis, 'Image Analysis');
        } else {
            showMessage(fileMessage, result.message, 'error');
        }
    } catch (error) {
        console.error('Error:', error);
        showMessage(fileMessage, 'An error occurred while analyzing the image.', 'error');
    } finally {
        analyzeImageBtn.textContent = '🤖 Analyze with AI';
        analyzeImageBtn.disabled = false;
    }
});

// Utility functions
function showMessage(element, message, type) {
    element.textContent = message;
    element.className = `message ${type}`;
    element.style.display = 'block';
}

function showAnimalImage(imagePath, animalName) {
    animalImage.src = imagePath;
    animalImage.alt = `${animalName} image`;
    animalImage.style.display = 'block';
    
    // Handle image load error
    animalImage.onerror = function() {
        showMessage(animalMessage, `Image for ${animalName} not found. Please add ${animalName}.jpg to the images folder.`, 'error');
        this.style.display = 'none';
    };
}

function hideAnimalImage() {
    animalImage.style.display = 'none';
    animalImage.src = '';
    hideAIInfo(animalAIInfo);
}

function showFileInfo(fileData) {
    const fileSizeFormatted = formatFileSize(fileData.file_size);
    
    fileInfo.innerHTML = `
        <h3>📄 File Information</h3>
        <p><strong>Name:</strong> ${fileData.filename}</p>
        <p><strong>Size:</strong> ${fileSizeFormatted}</p>
        <p><strong>Type:</strong> ${fileData.file_type || 'Unknown'}</p>
    `;
    fileInfo.style.display = 'block';
}

function hideFileInfo() {
    fileInfo.style.display = 'none';
    fileInfo.innerHTML = '';
    hideAIInfo(imageAIAnalysis);
}

function updateFileLabel(filename) {
    const fileText = document.querySelector('.file-text');
    fileText.textContent = `Selected: ${filename}`;
}

function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// AI Utility functions
function showAIInfo(container, contentElement, content, title) {
    contentElement.textContent = content;
    container.style.display = 'block';
    
    // Smooth scroll to AI info
    setTimeout(() => {
        container.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }, 100);
}

function hideAIInfo(container) {
    container.style.display = 'none';
}

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    console.log('Animal Selector & File Upload App with Gemini AI initialized');
});
