import { BedrockRuntimeClient, InvokeModelCommand, ConverseCommand } from "@aws-sdk/client-bedrock-runtime";



const modelIdMixtral = "mistral.mistral-7b-instruct-v0:2";
const modelIdHaiku = 'anthropic.claude-3-haiku-20240307-v1:0';

const invokeModel = async (
    prompt,
    modelId,
) => {


    // Create a new Bedrock Runtime client instance.
    const client = new BedrockRuntimeClient({
        region: 'us-east-1',
        credentials: {
            accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY_ID,
            secretAccessKey: process.env.REACT_APP_AWS_SECRET_ACCESS_KEY,
        }
    });

    // Prepare the payload for the model.
    const payload = {
        anthropic_version: "bedrock-2023-05-31",
        max_tokens: 1000,
        messages: [
            {
                role: "user",
                content: [{ type: "text", text: prompt }],
            },
        ],
    };

    // Invoke Claude with the payload and wait for the response.
    const command = new InvokeModelCommand({
        contentType: "application/json",
        body: JSON.stringify(payload),
        modelId,
    });

    const apiResponse = await client.send(command);

    // Decode and return the response(s)
    const decodedResponseBody = new TextDecoder().decode(apiResponse.body);
    const responseBody = JSON.parse(decodedResponseBody);
    return responseBody.content[0].text;
};


const ChatwithModel = async (prompt, modelId) =>{
   const client = new BedrockRuntimeClient({
    region: 'us-east-1',
    credentials: {
        accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.REACT_APP_AWS_SECRET_ACCESS_KEY,
    }
});
    // const formattedPrompts = JSON.stringify(prompt);
    // console.log(formattedPrompts);
    
    
  // Start a conversation with the user message.
//   const conversation = [
//     {
//       role: "user",
//       content: formattedPrompts,
//     },
//   ];
  
  // Create a command with the model ID, the message, and a basic configuration.
  const command = new ConverseCommand({
    modelId,
    messages: prompt,
    system: [{text: "Make every response smaller than 5 lines"}],
    inferenceConfig: { maxTokens: 512, temperature: 0.5, topP: 0.9 },
  });
  
  try {
    // Send the command to the model and wait for the response
    const response = await client.send(command);
  
    // Extract and print the response text.
    const responseText = response.output.message.content[0].text;
    return responseText;
    // console.log(responseText);
  } catch (err) {
    console.log(`ERROR: Can't invoke '${modelId}'. Reason: ${err}`);
    process.exit(1);
  }
};

//FOR Mixtral
//   const params = {
//     "modelId": modelId,
//     "contentType": "application/json",
//     "accept": "application/json",
//     "body": `{"prompt":"<s>[INST] ${Modelprompt} [/INST]", "max_tokens":512, "temperature":0.5, "top_p":0.9, "top_k":50}`
// }; 


export async function SendPrompt(Modelprompt) {
    try {
        //FOR Claude 3 Haiku
        let outputText = ChatwithModel(Modelprompt, modelIdHaiku);
        // let outputText = invokeModel(Modelprompt, modelIdHaiku);
        return outputText;

    } catch (error) {
        console.error('Error invoking the model:', error);
    }
}
