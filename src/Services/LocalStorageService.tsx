const setItem=(key:string, obj:any)=>{
    localStorage.setItem(key, JSON.stringify(obj));
}
const getItem=(key:string)=>{
    try {
        const raw = localStorage.getItem(key);
        if (!raw) return null;
        return JSON.parse(raw);
    } catch {
        localStorage.removeItem(key); // Remove corrupted data
        return null;
    }
}
const removeItem=(key:string)=>{
    localStorage.removeItem(key);
}   
export  {setItem, getItem, removeItem};