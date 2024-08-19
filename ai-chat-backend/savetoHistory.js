const axios = require('axios');


const saveConversationToDatabase = async(updatedPromptHistory) =>{
        try {
                // Send history to backend to save
                await axios.post('http://localhost:5000/api/saveHistory', updatedPromptHistory);
                console.log('History saved successfully');
            }
        catch (error) {
            console.error('Error saving history:', error);
        }

}
module.exports = { saveConversationToDatabase };

