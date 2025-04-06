/* Below are helper functions for the Spotify object/class in main Spotify.js file.
   There placed here for organization and to save space in Spotify.js file.
   Also provided commenting to explain how functions work.
*/


/* 1st, create the code_verifier, which is a high-entropy cryptographic 
        random string with 43-128 characters. To better under the below 
        function (and all other below, review this article again: 
        https://developer.spotify.com/documentation/web-api/tutorials/code-pkce-flow) */

export const generateRandomString = (length) => { // Generate random string for provided length

    // Pool of possible random characters for string (26 uppercase, 26 lowercase, 10 digits)
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    /* Next, generate a Uint8array (unsigned 8-bit integer array (0-255 range)) for given length
     * and then fill array with cryptographically secure random values.
     * Ex: [41, 233, 178, 3, 99, 74, 200, ...]
     */
    const values = crypto.getRandomValues(new Uint8Array(length));

    /* Then use a reducer function to convert the random values into string
     * by mapping each value to a character in 'possible' variable.
     */
    return values.reduce(
        (acc,x) => // 'acc' is accumulator starts with empty string("")
                   // 'x' is each random value from 'values' array

            /* Use modulus to keep index within character pool,
             * and then add selected char. to result string.
             */
            acc + possible[x % possible.length],"" // Initial accumulator value starts as empty stirng("");
    );
    /* How this ultimately works (via example):
       Iteration 1:
       -> acc=""
       -> x= 41 → 41 % 62 = 41 → possible[41]="p" 
       -> Result: acc="p"
    
       Iteration 2:
       -> acc="p"
       -> x = 233 → 233 % 62 = 47 = possible[47] ="v"
       -> Result: acc="pv" 

       Iteration 3:
       -> acc="pv"
       -> x = 178 → 178 % 62 = 54 → possible[54] = "2"
       -> Result: acc="pv2"

       And so forth......
    */
}


/* 2nd, after the code_verfiier is generated using the above function, it needs to be
   hashed/transformed via SHA256 algorithm. This value then gets sent wihtin the PKCE auth request */

export const sha256 = async (plain) => { // asynchronous function takes plain text as string input

    const encode = new TextEncoder(); // Created new TextEncoder to turn string into a Uint8Array (binary data)

    const data = encode.encode(plain); // Encode input string into sequence of bytes
                                       // (each letter turned into corresponding UTF-8 (Uint8Array) Byte value)
                                       // (e.g., "hello" → [104, 101, 108, 108, 111]))

    // Calls the SubtleCrypto API to generate a SHA-256 hash of input data
    return window.crypto.subtle.digest(
        'SHA-256', // Specify hashing algorithm. SHA-256 is a secure 256-bit crytographic hash function
        data       // Input to be hashed: a Uint8Array (binary data), typically created by TextEncoder.encode()
    );
}

/* 3rd, below function 'base64encode' returns the base64 representation
   of the digest calculated with previous sha256() function */

export const base64encode = (input) => { // function converts digest from sha256() into base64 output

    /* Convert input (which is ArrayBuffer) into a string:
     * 1. Wrap it in Uint8Array to access individual byte values
     * 2. Use String.fromCharCode(...bytes) to convert byte array to string of character
     * 3. Use btoa() (binary to ASCII) to encode string into Base64. 
     */

    return btoa(String.fromCharCode(...new Uint8Array(input)))
    /* The base64 string may include '=', which is used for padding.
       Remove all "=" characters to make it base64url-safe */
       .replace(/=/g, '')
       .replace(/\+/g, '-')  // Replace "+" with "-" (URL-safe: "+" is not valid in URLs)
       .replace(/\//g, '_'); // Replace "/" with "_" (URL-safe: "/" is not valid in URLs)
}
