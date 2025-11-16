

export const SLACK_URL_PATTERNS = {
    //MENSAGEM DENTRO DA THREAD
    THREAD_MESSAGE:(channel:string,threadTs:string, messageTs:string)=>
    `${channel}/p${threadTs}?thread_ts${threadTs}&cid=${messageTs}`,

    // MENSAGEM THREAD RAIZ
    THREAD_ROOT:(channel:string,ts:string)=>
    `${channel}/p${ts}`
}