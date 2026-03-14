# Gemini After Effects Assistant

A premium AI-powered chatbot extension for Adobe After Effects that translates your natural language prompts into professional animations and project structures using the Gemini API.

## Features
- **Prompt-to-Action**: Ask for compositions, layers, effects, or property changes in plain English.
- **Premium UI**: Glassmorphism design with smooth animations.
- **Gemini Integration**: Uses `gemini-pro` for intelligent script generation.
- **Real-time Execution**: Watch After Effects build your vision as you type.

## Installation
1.  **Enable Debug Mode** (required for unsigned extensions):
    - **Windows**: Open Registry Editor (`regedit`), navigate to `HKEY_CURRENT_USER\Software\Adobe\CSXS.11` (or your version), create a new String Value named `PlayerDebugMode` and set it to `1`.
2.  **Move Folder**:
    - Copy the `ae-gemini-assistant` folder to the Adobe extensions directory:
        - `C:\Users\<YOU>\AppData\Roaming\Adobe\CEP\extensions\`
3.  **Launch After Effects**:
    - Go to `Window` > `Extensions` > `Gemini AE Assistant`.

## Setup
1.  Get a Gemini API Key from [Google AI Studio](https://aistudio.google.com/).
2.  Enter the key into the settings field at the bottom of the panel.
3.  Start chatting!

## Examples
- "Create a 4K composition with 24fps and 10 seconds duration."
- "Add a red solid layer and apply a fast blur."
- "Create 10 text layers with names of planets."
- "Animate the opacity of the selected layer from 0 to 100 over 2 seconds."

## Project Structure
- `CSXS/manifest.xml`: Extension configuration.
- `client/`: UI files (HTML/CSS/JS).
- `host/`: ExtendScript files (AE Engine).
