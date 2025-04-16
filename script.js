const generateBtn = document.getElementById("generateBtn");
const outputTypeSelect = document.getElementById("outputType");
const generatedTitle = document.getElementById("generatedTitle");

// ✅ Make this available everywhere
function capitalizeWords(str) {
  return str.replace(/\b\w/g, char => char.toUpperCase());
}

outputTypeSelect.addEventListener("change", () => {
  const selectedType = outputTypeSelect.value;
  generatedTitle.textContent = `Generated ${capitalizeWords(selectedType)}:`;
});

generateBtn.addEventListener("click", async () => {
    const resume = document.getElementById("resume").value;
    const jobDesc = document.getElementById("jobDesc").value;
    const output = document.getElementById("output");
    const outputType = outputTypeSelect.value;
    const tone = document.getElementById("tone").value;
    const jobTitle = document.getElementById("jobTitle").value;
    const loading = document.getElementById("loading");
    const downloadBtn = document.getElementById("downloadBtn");
  
    // Update title and show loading
    generatedTitle.textContent = `Generated ${capitalizeWords(outputType)}:`;
    loading.style.display = "block";
    output.textContent = "";
    downloadBtn.style.display = "none";
  
    const prompt = `
  You are a professional AI assistant that specializes in career writing.
  Write a ${outputType} for the position of ${jobTitle}.
  Use a ${tone} tone throughout.
  
  Base your writing on the resume and job description below:
  
  Resume:
  ${resume}
  
  Job Description:
  ${jobDesc}
  `;
  
  try {
    const response = await fetch("http://localhost:5000/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ prompt })
    });
  
    const data = await response.json();
    output.textContent = data.result;

      downloadBtn.style.display = "inline-block"; // show download button
    } catch (err) {
      output.textContent = "Error: " + err.message;
    } finally {
      loading.style.display = "none";
    }
  });

  document.getElementById("downloadBtn").addEventListener("click", () => {
    const text = document.getElementById("output").textContent;
    const blob = new Blob([text], { type: "text/plain" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "generated-output.txt";
    link.click();
  });
  
  const recordBtn = document.getElementById("recordBtn");
const recordStatus = document.getElementById("recordStatus");
let mediaRecorder, audioChunks = [];

recordBtn.addEventListener("click", async () => {
  // Step 1: Ask permission to use the microphone
  if (!mediaRecorder || mediaRecorder.state === "inactive") {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    console.log("🎙️ Supported MIME types:");
[
  'audio/webm',
  'audio/webm;codecs=opus',
  'audio/webm;codecs=vorbis',
  'audio/ogg',
  'audio/wav',
  'audio/mpeg'
].forEach(type => {
  if (MediaRecorder.isTypeSupported(type)) {
    console.log(`✅ ${type}`);
  } else {
    console.log(`❌ ${type}`);
  }
});

    mediaRecorder = new MediaRecorder(stream, { mimeType: 'audio/webm;codecs=opus' });

    if (!MediaRecorder.isTypeSupported('audio/webm;codecs=opus')) {
  alert("Your browser does not support 'audio/webm;codecs=opus'. Try using Chrome.");
  return;
}

    audioChunks = [];

    mediaRecorder.start();
    recordStatus.textContent = "Recording... click again to stop.";

    mediaRecorder.ondataavailable = e => audioChunks.push(e.data);

    mediaRecorder.ondataavailable = e => {
        console.log("🎧 Received data chunk:", e.data);
        audioChunks.push(e.data);
      };
      

    // Step 2: Once recording is stopped
    mediaRecorder.onstop = async () => {
      recordStatus.textContent = "Transcribing with Deepgram...";

      const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
      console.log("📦 Recorded Blob MIME type:", audioBlob.type);

      const audioBuffer = await audioBlob.arrayBuffer();
      console.log("📏 Audio buffer length:", audioBuffer.byteLength);
      console.log("🧬 First 8 bytes:", new Uint8Array(audioBuffer.slice(0, 8)));


      try {
        const response = await fetch("http://localhost:5000/transcribe", {
            method: "POST",
            headers: {
              "Content-Type": "audio/webm"
            },
            body: audioBuffer
          });
          

          const data = await response.json();
          const transcript = data.results?.channels?.[0]?.alternatives?.[0]?.transcript;
          console.log("🧾 Full Deepgram response:", data);
          console.log("📝 Extracted transcript:", transcript);

          
          if (typeof transcript === 'string' && transcript.length > 0) {

            document.getElementById("resume").value = transcript;
            recordStatus.textContent = "Transcript added to Resume field!";
          } else {
            console.error("Deepgram Error:", data);
            recordStatus.textContent = "Deepgram returned an error. Check the format or API key.";
          }
          
      } catch (err) {
        recordStatus.textContent = "Error during transcription.";
        console.error(err);
      }
    };
  }

  if (mediaRecorder.state === "recording") {
    setTimeout(() => {
      mediaRecorder.stop();
    }, 45000); // wait 45 seconds to ensure data is available
  }
});

