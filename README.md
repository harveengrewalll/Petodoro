# Petodoro

Petodoro is a fun, interactive browser-based study companion that helps you **stay focused**. Your pixel pet mirrors your habits: if you pick up your phone during a focus session, your pet “dies.” Stay focused to keep your companion happy and earn snacks!  

Built with **React**, **TailwindCSS**, **TensorFlow.js**, and **Google Gemini Vision AI**, this project combines **real-time AI detection** with **pixel art animations** to make studying engaging and motivating.

---

## Features

- **Real-time phone detection:** Uses TensorFlow.js COCO-SSD to detect if you’re holding a phone during focus sessions.  
- **Interactive pixel pet:** Pet responds to your study habits and changes animations based on your focus.  
- **Focus timer & breaks:** Follow the Pomodoro method with configurable focus and break intervals.  
- **Snack rewards:** Earn food for your pet by completing focus sessions successfully.  
- **Fun visual feedback:** Animated pixel pet and warning messages if phone usage is detected.  

---

## Demo

![Demo Screenshot](./demo-screenshot.png)  
*(Replace with your own screenshot or GIF)*

---

## Installation & Setup

### 1. Clone the repo

```bash
git clone https://github.com/<your-username>/pixel-pet-academy.git
cd pixel-pet-academy
```

### 2. Install dependencies
```bash 
npm install
```

### 3. Set up environment variables
Create a .env.local file in the root of the project:
```bash
GEMINI_API_KEY=your_google_genai_api_key_here
```
Note: You need a valid Google Gemini API key for phone detection. You can still run the app without it, but phone detection will be disabled.

### 4. Run the app
```bash
npm run dev
```
Open http://localhost:3000 in your browser.

## How to play
1. Choose your pixel pet on the start screen.
2. Press START to begin a focus session.
3. Study for 25 minutes (default) without picking up your phone.
4. If the phone is detected, your pet will “die.”
5. Complete focus sessions to earn snacks for your pet.
6. Take a 5-minute break after each focus session.

## Tech Stack
- React & TypeScript – Frontend framework and type safety.
- TailwindCSS – Styling and responsive design.
- TensorFlow.js COCO-SSD – Real-time object detection.
- Google Gemini Vision AI – Phone detection using AI image analysis.
- Canvas API – Drawing detection overlays.

## Future Improvements
- Add more pet types and animations.
- Customize focus/break intervals.
- Integrate AI-based expression recognition for extra interactivity.
- Mobile-friendly interface.




