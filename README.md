# pouya`s Discord Clone

### Short Description

This is the user interface for joining rooms and participating in voice and text chats, built using **Next.js**, **Redux**, **Tailwind CSS**, and **CSS**.

Backend Code: [discord-clone-server](https://github.com/facepalm0075/discord-clone-server)

Live Test: [discord.pouya](https://discord.pouyaprogramming.ir/)

---

## Features

- **Responsive Design:** Fully functional across devices of different screen sizes.
- **Change Theme:** Users can switch between different themes.
- **Adjust Output Volume:** Allows users to change the volume of audio output.
- **Microphone Threshold Control:** Users can set the mic sensitivity threshold.

---

## Prerequisites

- **Node.js**
- **npm**

---

## How to Run

1. Update backend addresses:

   - Modify the backend addresses in the following components:
     - `/app/components/useSocketConnector.ts`
     - `/app/components/MainComponent.ts`

2. Build the project:

   ```bash
   npm run build
   ```

3. The static output files (HTML, CSS, and JS) will be available in the `dist` folder.

### How It Works

When you join a room, the app connects to your browser API and starts capturing raw audio stream data from your microphone. Using the **Opus codec library**, implemented via WebAssembly for encode and decode the audio data, the app performs the following steps in real-time:

- Converts raw audio data (likely at 48kHz) to 24kHz to reduce size.
- Buffers the converted audio data until it reaches 20ms.
- Compresses the buffered audio data.
- Streams the compressed data to the server via WebSocket.

When receiving audio data from other users through the server:

- The app decompresses the data.
- Buffers the decompressed audio for approximately half a second to ensure smooth playback.
- Begins playback, which might introduce a slight delay due to the buffering process.

---

### Author

This project was developed by **Pouya Bahmanyar**.
