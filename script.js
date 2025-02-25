document.addEventListener("DOMContentLoaded", function () {
    const chatBox = document.getElementById("chat-box");
    const userInput = document.getElementById("user-input");
    const sendBtn = document.getElementById("send-btn");

    // Función para agregar un mensaje al chat-box
    function appendMessage(text, type) {
        const messageDiv = document.createElement("div");
        messageDiv.classList.add("message", type);
        messageDiv.textContent = text;
        chatBox.appendChild(messageDiv);
        chatBox.scrollTop = chatBox.scrollHeight; // Auto-scroll al final
    }

    // Función para obtener la respuesta de la IA usando un modelo en español
    async function getAIResponse(message) {
        // Usamos el modelo español "mrm8488/spanish-gpt2"
        const API_URL = "https://api-inference.huggingface.co/models/smirki/UIGEN-T1-Qwen-7b";
        const API_TOKEN = "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";  // Reemplaza con tu token de Hugging Face

        try {
            const response = await fetch(API_URL, {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${API_TOKEN}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ inputs: message })
            });

            const result = await response.json();
            console.log(result); // Muestra la respuesta en la consola

            // El formato de respuesta puede variar; intentamos extraer el texto generado:
            return result[0]?.generated_text || result.generated_text || "No entendí eso.";
        } catch (error) {
            console.error("Error al llamar la API:", error);
            return "Hubo un error al obtener la respuesta.";
        }
    }

    // Función para manejar el envío del mensaje
    async function sendMessage() {
        const message = userInput.value.trim();
        if (message === "") return;

        // Agregar mensaje del usuario
        appendMessage(message, "user");
        userInput.value = "";

        // Agregar mensaje de "Pensando..."
        const loadingMessage = document.createElement("div");
        loadingMessage.classList.add("message", "bot");
        loadingMessage.textContent = "Pensando...";
        chatBox.appendChild(loadingMessage);
        chatBox.scrollTop = chatBox.scrollHeight;

        // Obtener respuesta de la IA
        const aiResponse = await getAIResponse(message);

        // Reemplazar el mensaje "Pensando..." por la respuesta de la IA
        loadingMessage.textContent = aiResponse;
    }

    // Evento para el botón de enviar
    sendBtn.addEventListener("click", sendMessage);

    // Evento para la tecla Enter en el input
    userInput.addEventListener("keypress", function (event) {
        if (event.key === "Enter") {
            sendMessage();
        }
    });
});
