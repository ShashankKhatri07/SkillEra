const profanityList = [
    "fuck", "shit", "bitch", "cunt", "asshole", "bastard", "damn", "hell",
    "piss", "dick", "pussy", "nigger", "faggot"
    // This list can be expanded significantly
];

const familyTerms = [
    "mother", "father", "sister", "brother", "mom", "dad", "son", "daughter",
    "uncle", "aunt", "cousin", "grandma", "grandpa", "grandmother", "grandfather"
];

const regexPatterns = {
    ipAddress: /\b\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\b/,
    email: /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/i,
    phone: /\b(?:\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}\b/
};

export const validateText = (text: string, fieldName: string = 'Input'): string | null => {
    const lowerCaseText = text.toLowerCase();

    // Check for profanity
    for (const word of profanityList) {
        if (lowerCaseText.includes(word)) {
            return `The ${fieldName} contains inappropriate language. Please remove it.`;
        }
    }

    // Check for family terms
    for (const term of familyTerms) {
        if (lowerCaseText.includes(term)) {
            return `Please do not include personal information about family members in the ${fieldName}.`;
        }
    }

    // Check for sensitive data using regex
    if (regexPatterns.ipAddress.test(text)) {
        return `The ${fieldName} appears to contain an IP address, which is not allowed.`;
    }
    if (regexPatterns.email.test(text)) {
        return `The ${fieldName} appears to contain an email address, which is not allowed.`;
    }
    if (regexPatterns.phone.test(text)) {
        return `The ${fieldName} appears to contain a phone number, which is not allowed.`;
    }

    return null; // No validation errors
};