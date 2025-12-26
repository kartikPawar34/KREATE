# Import necessary libraries
from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
from PIL import Image, ImageFilter, ImageEnhance, ImageOps, ImageDraw # Import ImageDraw for circular cropping
from io import BytesIO
from rembg import remove
import logging
import math

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize the Flask application
app = Flask(__name__)
# Enable CORS for all origins
CORS(app)

# Test route to confirm server is running and accessible
@app.route('/', methods=['GET'])
def home():
    logger.info("GET request received at /")
    return "Kreate Backend is running! Available endpoints: /remove-background, /crop-image, /sharpen-image, /black-and-white, /adjust-hue, /adjust-contrast, /adjust-saturation, /invert-colors."

# Endpoint for background removal
@app.route('/remove-background', methods=['POST', 'OPTIONS'])
def remove_background():
    logger.info(f"Request received at /remove-background. Method: {request.method}")
    if request.method == 'OPTIONS':
        logger.info("Responding to OPTIONS (preflight) request for /remove-background.")
        return '', 204

    if 'image' not in request.files:
        logger.warning("No image file provided for background removal.")
        return jsonify({'error': 'No image file provided'}), 400

    image_file = request.files['image']
    if image_file.filename == '':
        logger.warning("Empty image file provided for background removal.")
        return jsonify({'error': 'No selected image file'}), 400

    try:
        logger.info(f"Processing image for background removal: {image_file.filename}")
        input_image_bytes = image_file.read()
        input_image = Image.open(BytesIO(input_image_bytes)).convert("RGBA") # Ensure RGBA for transparency
        output_image = remove(input_image)

        output_buffer = BytesIO()
        output_image.save(output_buffer, format='PNG')
        output_buffer.seek(0)

        logger.info("Background removal successful. Sending response.")
        return send_file(output_buffer, mimetype='image/png', as_attachment=False, download_name='no_background.png')

    except Exception as e:
        logger.error(f"Error processing image for background removal: {str(e)}", exc_info=True)
        return jsonify({'error': f'Image processing failed: {str(e)}'}), 500

# Endpoint for image cropping (Now handles rectangular and circular)
@app.route('/crop-image', methods=['POST', 'OPTIONS'])
def crop_image():
    logger.info(f"Request received at /crop-image. Method: {request.method}")
    if request.method == 'OPTIONS':
        logger.info("Responding to OPTIONS (preflight) request for /crop-image.")
        return '', 204

    if 'image' not in request.files:
        logger.warning("No image file provided for cropping.")
        return jsonify({'error': 'No image file provided'}), 400

    image_file = request.files['image']
    if image_file.filename == '':
        logger.warning("Empty image file provided for cropping.")
        return jsonify({'error': 'No selected image file'}), 400

    try:
        logger.info(f"Processing image for cropping: {image_file.filename}")
        input_image_bytes = image_file.read()
        input_image = Image.open(BytesIO(input_image_bytes)).convert("RGBA") # Ensure RGBA for transparency

        # Get crop coordinates from form data (dynamic input)
        x = int(request.form.get('x', 0))
        y = int(request.form.get('y', 0))
        width = int(request.form.get('width', input_image.width))
        height = int(request.form.get('height', input_image.height))
        is_circular = request.form.get('circular', 'false').lower() == 'true' # Get circular flag

        # Validate and adjust coordinates to be within image bounds
        x = max(0, min(x, input_image.width))
        y = max(0, min(y, input_image.height))
        width = max(0, min(width, input_image.width - x))
        height = max(0, min(height, input_image.height - y))

        if width <= 0 or height <= 0:
            raise ValueError("Crop width and height must be positive.")

        # Perform rectangular crop first
        box = (x, y, x + width, y + height)
        cropped_image = input_image.crop(box)

        if is_circular:
            logger.info("Applying circular mask to cropped image.")
            # Create a transparent image to draw the circle on
            mask = Image.new('L', cropped_image.size, 0) # 'L' for grayscale (mask)
            draw = ImageDraw.Draw(mask)
            # Draw a filled white ellipse (circle) on the mask
            # The ellipse coordinates are relative to the cropped_image size
            draw.ellipse((0, 0, cropped_image.width, cropped_image.height), fill=255)

            # Apply the mask to the cropped image
            # We create a new RGBA image, paste the cropped_image, and use the mask as alpha
            result_image = Image.new('RGBA', cropped_image.size, (0, 0, 0, 0)) # Start with fully transparent
            result_image.paste(cropped_image, (0, 0), mask)
            cropped_image = result_image # Update cropped_image to the circular result

        output_buffer = BytesIO()
        cropped_image.save(output_buffer, format='PNG') # Always save as PNG for transparency
        output_buffer.seek(0)

        logger.info(f"Image cropping successful (circular: {is_circular}). Sending response.")
        return send_file(output_buffer, mimetype='image/png', as_attachment=False, download_name='cropped_image.png')

    except ValueError as ve:
        logger.error(f"Invalid crop coordinates: {ve}", exc_info=True)
        return jsonify({'error': f'Invalid crop coordinates: {str(ve)}'}), 400
    except Exception as e:
        logger.error(f"Error processing image for cropping: {str(e)}", exc_info=True)
        return jsonify({'error': f'Image processing failed: {str(e)}'}), 500

# Endpoint for image sharpening (with intensity)
@app.route('/sharpen-image', methods=['POST', 'OPTIONS'])
def sharpen_image():
    logger.info(f"Request received at /sharpen-image. Method: {request.method}")
    if request.method == 'OPTIONS':
        logger.info("Responding to OPTIONS (preflight) request for /sharpen-image.")
        return '', 204

    if 'image' not in request.files:
        logger.warning("No image file provided for sharpening.")
        return jsonify({'error': 'No image file provided'}), 400

    image_file = request.files['image']
    if image_file.filename == '':
        logger.warning("Empty image file provided for sharpening.")
        return jsonify({'error': 'No selected image file'}), 400

    try:
        logger.info(f"Processing image for sharpening: {image_file.filename}")
        input_image_bytes = image_file.read()
        input_image = Image.open(BytesIO(input_image_bytes)).convert("RGBA")

        # Get intensity factor (0.0 to 1.0 from frontend 0-100%)
        intensity_factor = float(request.form.get('intensity', 1.0)) # Default to 1.0 (normal sharpen)

        # Apply sharpening filter with intensity
        enhancer = ImageEnhance.Sharpness(input_image)
        # Map 0-1 intensity from frontend to a factor for ImageEnhance.Sharpness
        # Factor 1.0 is original, higher values increase sharpness.
        # Let's map 0-1 to 0.5-3.0 for a good range (0.5 slightly blurred, 1.0 original, 3.0 very sharp)
        sharpen_factor = 0.5 + (intensity_factor * 2.5) # Maps 0-1 to 0.5-3.0
        sharpened_image = enhancer.enhance(sharpen_factor)


        output_buffer = BytesIO()
        sharpened_image.save(output_buffer, format='PNG')
        output_buffer.seek(0)

        logger.info(f"Image sharpening successful with intensity {intensity_factor}. Sending response.")
        return send_file(output_buffer, mimetype='image/png', as_attachment=False, download_name='sharpened_image.png')

    except Exception as e:
        logger.error(f"Error processing image for sharpening: {str(e)}", exc_info=True)
        return jsonify({'error': f'Image sharpening failed: {str(e)}'}), 500

# Endpoint for black and white conversion (with intensity)
@app.route('/black-and-white', methods=['POST', 'OPTIONS'])
def black_and_white():
    logger.info(f"Request received at /black-and-white. Method: {request.method}")
    if request.method == 'OPTIONS':
        logger.info("Responding to OPTIONS (preflight) request for /black-and-white.")
        return '', 204

    if 'image' not in request.files:
        logger.warning("No image file provided for B&W conversion.")
        return jsonify({'error': 'No image file provided'}), 400

    image_file = request.files['image']
    if image_file.filename == '':
        logger.warning("Empty image file provided for B&W conversion.")
        return jsonify({'error': 'No selected image file'}), 400

    try:
        logger.info(f"Processing image for B&W conversion: {image_file.filename}")
        input_image_bytes = image_file.read()
        input_image = Image.open(BytesIO(input_image_bytes)).convert("RGBA")

        # Get intensity factor (0.0 to 1.0 from frontend 0-100%)
        intensity_factor = float(request.form.get('intensity', 1.0)) # Default to 1.0 (full B&W)

        # Convert to grayscale
        bw_image = input_image.convert('L') # 'L' mode is grayscale

        # If intensity is less than 1.0, blend with original color image
        if intensity_factor < 1.0:
            # Convert grayscale back to RGBA to blend with original
            bw_image_rgba = bw_image.convert("RGBA")
            # Alpha blend: (1-alpha) * original + alpha * bw_image
            # Here, intensity_factor acts as the alpha for the B&W image
            bw_image = Image.blend(input_image, bw_image_rgba, intensity_factor)
        else:
            # If intensity is 1.0 (100%), just use the grayscale image
            bw_image = bw_image.convert("RGBA") # Ensure it's RGBA for consistent output

        output_buffer = BytesIO()
        bw_image.save(output_buffer, format='PNG') # Save as PNG
        output_buffer.seek(0)

        logger.info(f"Image B&W conversion successful with intensity {intensity_factor}. Sending response.")
        return send_file(output_buffer, mimetype='image/png', as_attachment=False, download_name='bw_image.png')

    except Exception as e:
        logger.error(f"Error processing image for B&W conversion: {str(e)}", exc_info=True)
        return jsonify({'error': f'Image B&W conversion failed: {str(e)}'}), 500

# NEW: Endpoint for Hue adjustment
# This uses ImageEnhance.Color and then manually shifts hue in HSV space for better control.
@app.route('/adjust-hue', methods=['POST', 'OPTIONS'])
def adjust_hue():
    logger.info(f"Request received at /adjust-hue. Method: {request.method}")
    if request.method == 'OPTIONS':
        logger.info("Responding to OPTIONS (preflight) request for /adjust-hue.")
        return '', 204

    if 'image' not in request.files:
        logger.warning("No image file provided for hue adjustment.")
        return jsonify({'error': 'No image file provided'}), 400

    image_file = request.files['image']
    if image_file.filename == '':
        logger.warning("Empty image file provided for hue adjustment.")
        return jsonify({'error': 'No selected image file'}), 400

    try:
        logger.info(f"Processing image for hue adjustment: {image_file.filename}")
        input_image_bytes = image_file.read()
        input_image = Image.open(BytesIO(input_image_bytes)).convert("RGB") # Convert to RGB for HSV conversion

        # Get hue shift from frontend (e.g., -180 to 180 degrees)
        # Frontend sends 0-100. Map 0 to 0.0, 50 to 1.0, 100 to 2.0.
        hue_shift_degrees = float(request.form.get('hue_shift', 0.0)) # Default to 0.0 (no shift)

        # Convert to HSV, shift hue, convert back to RGB
        hsv_image = input_image.convert('HSV')
        pixels = hsv_image.load()
        width, height = hsv_image.size

        for y in range(height):
            for x in range(width):
                h, s, v = pixels[x, y]
                # Hue in Pillow's HSV is 0-255, representing 0-360 degrees.
                # Convert original hue (0-255) to degrees (0-360)
                h_degrees = (h / 255.0) * 360.0
                # Apply shift
                new_h_degrees = h_degrees + hue_shift_degrees
                # Wrap around 0-360
                new_h_degrees = new_h_degrees % 360
                if new_h_degrees < 0:
                    new_h_degrees += 360
                
                # Convert back to Pillow's 0-255 range
                new_h = int((new_h_degrees / 360.0) * 255)
                
                pixels[x, y] = (new_h, s, v)

        hue_adjusted_image = hsv_image.convert('RGB')

        output_buffer = BytesIO()
        hue_adjusted_image.save(output_buffer, format='PNG')
        output_buffer.seek(0)

        logger.info(f"Image hue adjustment successful with shift {hue_shift_degrees}. Sending response.")
        return send_file(output_buffer, mimetype='image/png', as_attachment=False, download_name='hue_adjusted_image.png')

    except Exception as e:
        logger.error(f"Error processing image for hue adjustment: {str(e)}", exc_info=True)
        return jsonify({'error': f'Image hue adjustment failed: {str(e)}'}), 500


# NEW: Endpoint for Contrast adjustment
@app.route('/adjust-contrast', methods=['POST', 'OPTIONS'])
def adjust_contrast():
    logger.info(f"Request received at /adjust-contrast. Method: {request.method}")
    if request.method == 'OPTIONS':
        logger.info("Responding to OPTIONS (preflight) request for /adjust-contrast.")
        return '', 204

    if 'image' not in request.files:
        logger.warning("No image file provided for contrast adjustment.")
        return jsonify({'error': 'No image file provided'}), 400

    image_file = request.files['image']
    if image_file.filename == '':
        logger.warning("Empty image file provided for contrast adjustment.")
        return jsonify({'error': 'No selected image file'}), 400

    try:
        logger.info(f"Processing image for contrast adjustment: {image_file.filename}")
        input_image_bytes = image_file.read()
        input_image = Image.open(BytesIO(input_image_bytes)).convert("RGBA")

        # Get contrast factor (e.g., 0.0 to 2.0)
        # Frontend sends 0-100. Map 0 to 0.0, 50 to 1.0, 100 to 2.0.
        contrast_factor = float(request.form.get('factor', 1.0)) # Default to 1.0 (original contrast)

        enhancer = ImageEnhance.Contrast(input_image)
        contrast_adjusted_image = enhancer.enhance(contrast_factor)

        output_buffer = BytesIO()
        contrast_adjusted_image.save(output_buffer, format='PNG')
        output_buffer.seek(0)

        logger.info(f"Image contrast adjustment successful with factor {contrast_factor}. Sending response.")
        return send_file(output_buffer, mimetype='image/png', as_attachment=False, download_name='contrast_adjusted_image.png')

    except Exception as e:
        logger.error(f"Error processing image for contrast adjustment: {str(e)}", exc_info=True)
        return jsonify({'error': f'Image contrast adjustment failed: {str(e)}'}), 500

# NEW: Endpoint for Saturation adjustment
@app.route('/adjust-saturation', methods=['POST', 'OPTIONS'])
def adjust_saturation():
    logger.info(f"Request received at /adjust-saturation. Method: {request.method}")
    if request.method == 'OPTIONS':
        logger.info("Responding to OPTIONS (preflight) request for /adjust-saturation.")
        return '', 204

    if 'image' not in request.files:
        logger.warning("No image file provided for saturation adjustment.")
        return jsonify({'error': 'No image file provided'}), 400

    image_file = request.files['image']
    if image_file.filename == '':
        logger.warning("Empty image file provided for saturation adjustment.")
        return jsonify({'error': 'No selected image file'}), 400

    try:
        logger.info(f"Processing image for saturation adjustment: {image_file.filename}")
        input_image_bytes = image_file.read()
        input_image = Image.open(BytesIO(input_image_bytes)).convert("RGBA")

        # Get saturation factor (e.g., 0.0 to 2.0)
        # Frontend sends 0-100. Map 0 to 0.0, 50 to 1.0, 100 to 2.0.
        saturation_factor = float(request.form.get('factor', 1.0)) # Default to 1.0 (original saturation)

        enhancer = ImageEnhance.Color(input_image) # ImageEnhance.Color adjusts saturation
        saturation_adjusted_image = enhancer.enhance(saturation_factor)

        output_buffer = BytesIO()
        saturation_adjusted_image.save(output_buffer, format='PNG')
        output_buffer.seek(0)

        logger.info(f"Image saturation adjustment successful with factor {saturation_factor}. Sending response.")
        return send_file(output_buffer, mimetype='image/png', as_attachment=False, download_name='saturation_adjusted_image.png')

    except Exception as e:
        logger.error(f"Error processing image for saturation adjustment: {str(e)}", exc_info=True)
        return jsonify({'error': f'Image saturation adjustment failed: {str(e)}'}), 500

# NEW: Endpoint for Invert Color
@app.route('/invert-colors', methods=['POST', 'OPTIONS'])
def invert_colors():
    logger.info(f"Request received at /invert-colors. Method: {request.method}")
    if request.method == 'OPTIONS':
        logger.info("Responding to OPTIONS (preflight) request for /invert-colors.")
        return '', 204

    if 'image' not in request.files:
        logger.warning("No image file provided for color inversion.")
        return jsonify({'error': 'No image file provided'}), 400

    image_file = request.files['image']
    if image_file.filename == '':
        logger.warning("Empty image file provided for color inversion.")
        return jsonify({'error': 'No selected image file'}), 400

    try:
        logger.info(f"Processing image for color inversion: {image_file.filename}")
        input_image_bytes = image_file.read()
        # Invert works best on RGB, convert if necessary.
        # If input is RGBA, convert to RGB for inversion, then back to RGBA if transparency is needed.
        input_image = Image.open(BytesIO(input_image_bytes)).convert("RGB")

        inverted_image = ImageOps.invert(input_image)

        output_buffer = BytesIO()
        inverted_image.save(output_buffer, format='PNG') # Save as PNG to preserve potential alpha if original was RGBA
        output_buffer.seek(0)

        logger.info("Image color inversion successful. Sending response.")
        return send_file(output_buffer, mimetype='image/png', as_attachment=False, download_name='inverted_image.png')

    except Exception as e:
        logger.error(f"Error processing image for color inversion: {str(e)}", exc_info=True)
        return jsonify({'error': f'Image color inversion failed: {str(e)}'}), 500


# Run the Flask application
if __name__ == '__main__':
    app.run(debug=True, port=5000)
