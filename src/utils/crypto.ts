export async function computeHash(blob: Blob): Promise<string> {
    try {
        const reader = new FileReader();

        return new Promise<Uint8Array>((resolve, reject) => {
            reader.onloadend = () => {
                if (reader.error) {
                    reject(reader.error);
                } else {
                    resolve(new Uint8Array(reader.result as ArrayBuffer));
                }
            };
            reader.onerror = reject;
            reader.readAsArrayBuffer(blob);
        })
            .then((arrayBuffer) => crypto.subtle.digest('SHA-256', arrayBuffer))
            .then((hashBuffer) => {
                const hashArray = Array.from(new Uint8Array(hashBuffer));
                return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
            });
    } catch (error) {
        console.error('Error computing hash:', error);
        throw error; // Rethrow if you want to handle it further up the chain
    }
}
