async function listModels() {
  try {
    const models = await genAI.listModels();
    console.log("Available models:", models);
  } catch (err) {
    console.error("Error listing models:", err);
  }
}

listModels();