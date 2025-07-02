async function getEmoji(optionName) {
    let query = optionName.toLowerCase();

    try {
        let response = await fetch(`https://emoji-api.com/emojis?search=${query}&access_key=YOUR_API_KEY`);
        let data = await response.json();

        if (data.length > 0) {
            return data[0].character; // Return the first matched emoji
        } else {
            return ""; // No emoji found
        }
    } catch (error) {
        console.error("Error fetching emoji:", error);
        return "";
    }
}
