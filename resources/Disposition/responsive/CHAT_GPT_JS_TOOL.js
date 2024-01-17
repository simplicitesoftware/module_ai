class GPTJsTool {
    constructor() {
        this.apiUrl = Simplicite.ROOT+"/ext/GptRestAPI";
    }

    callAPIonObject() {
        console.log('La propriété est: ' + this.apiUrl);
    }
}