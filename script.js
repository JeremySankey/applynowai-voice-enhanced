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
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer ***REMOVED***uVGoutiQjmN28tI0JZyYS86Ip3wVY943nTpkfkkQMtOYsYicABbssc_eGqLnvhPDzFxGYuSnCfT3BlbkFJ2tJXhGW6YBK9etG3AdfvwYm85WkJqAj6XdzJK9Cc7tiVleerWnBpN4a-ZiumEs12e-4uZSBdkA"
        },
        body: JSON.stringify({
          model: "gpt-3.5-turbo",
          messages: [{ role: "user", content: prompt }],
          temperature: 0.7
        })
      });
  
      const data = await response.json();
      output.textContent = data.choices[0].message.content;
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
    mediaRecorder = new MediaRecorder(stream);
    audioChunks = [];

    mediaRecorder.start();
    recordStatus.textContent = "Recording... click again to stop.";

    mediaRecorder.ondataavailable = e => audioChunks.push(e.data);

    // Step 2: Once recording is stopped
    mediaRecorder.onstop = async () => {
      recordStatus.textContent = "Transcribing with Deepgram...";

      const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
      const audioBuffer = await audioBlob.arrayBuffer();


      try {
        const response = await fetch("https://api.deepgram.com/v1/listen", {
          method: "POST",
          headers: {
            "Authorization": "Token 71ff69a05aff609ad62b5a0c358d8168c7ec9640",
            "Content-Type": "audio/webm",
            "dg-encoding": "opus",
            "dg-language": "en-US"
          },

          body: audioBuffer
        });

        const data = await response.json();
        
        if (data.results && data.results.channels) {
            const transcript = data.results.channels[0].alternatives[0].transcript;
            document.getElementById("resume").value = transcript;
            recordStatus.textContent = "Transcript added to Resume field!";
          } else {
            console.error("Deepgram Error:", data);
            recordStatus.textContent = "Deepgram returned an error. Check the format or API key.";
          }
         

        // Step 3: Put the transcript into the Resume box
        document.getElementById("resume").value = transcript;
        recordStatus.textContent = "Transcript added to Resume field!";
      } catch (err) {
        recordStatus.textContent = "Error during transcription.";
        console.error(err);
      }
    };
  }

  // Step 4: If it’s already recording and you click again, stop recording
  if (mediaRecorder.state === "recording") {
    mediaRecorder.stop();
  }
});

