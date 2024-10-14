import keyboard
import pygetwindow as gw
from fuzzywuzzy import fuzz

# Define the topic and list of common words to ignore
topic = "artificial intelligence"
common_words = {"the", "also", "and", "that", "if", "is", "it", "in", "on", "at", "to", "with", "for"}
typed_characters = []

def minimize_current_window():
    try:
        window = gw.getActiveWindow()
        if window:
            window.minimize()
    except Exception as e:
        print(f"Error minimizing window: {e}")

def check_input(event):
    global typed_characters

    if event.name == 'space':
        input_text = ''.join(typed_characters).strip()
        typed_characters = []

        # Split the input text into words and filter out common words
        words = input_text.split()
        filtered_words = [word for word in words if word.lower() not in common_words]
        
        if not filtered_words:
            return

        # Join filtered words for relevance checking
        filtered_text = ' '.join(filtered_words)
        
        # Use fuzzy matching to check similarity with the topic
        similarity = fuzz.token_set_ratio(filtered_text.lower(), topic.lower())
        if similarity >= 70:  # Adjust this threshold as needed
            print(f"Valid input detected: {filtered_text}")
        else:
            print(f"Invalid input detected: {filtered_text}. Minimizing current window.")
            minimize_current_window()
    elif event.name == 'backspace':
        if typed_characters:
            typed_characters.pop()
    else:
        typed_characters.append(event.name)

# Set up the keyboard hook
keyboard.on_press(check_input)

print("Keyboard monitoring started. Press ESC to stop.")
keyboard.wait('esc')
