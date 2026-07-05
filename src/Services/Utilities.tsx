const formatDate=(dateString:string)=>{
    if (!dateString) return '';
    // Already human-readable (e.g. "Apr 2022", "Present") — return as-is
    if (!/^\d{4}-/.test(dateString)) return dateString;
    const date = new Date(dateString);
    const options = { year: 'numeric' as const, month: 'short' as const };
    return date.toLocaleString('en-US', options);
  }

  function timeAgo(timestamp:string) {
    if (!timestamp) return "Unknown";
    const postDate = new Date(timestamp);
    if (isNaN(postDate.getTime())) return "Unknown";
    const now = new Date();
    const diffInMs = now.getTime() - postDate.getTime();

  
    const seconds = Math.floor(diffInMs / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    const months = Math.floor(days / 30);
    const years = Math.floor(months / 12);
  
    if (seconds < 60) {
      return `${seconds} second${seconds === 1 ? '' : 's'} ago`;
    } else if (minutes < 60) {
      return `${minutes} minute${minutes === 1 ? '' : 's'} ago`;
    } else if (hours < 24) {
      return `${hours} hour${hours === 1 ? '' : 's'} ago`;
    } else if (days < 30) {
      return `${days} day${days === 1 ? '' : 's'} ago`;
    } else if (months < 12) {
      return `${months} month${months === 1 ? '' : 's'} ago`;
    } else {
      return `${years} year${years === 1 ? '' : 's'} ago`;
    }
  }
  const getBase64 = (file:any) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });
};
const openPDF=(base64: string)=>{
  const byteCharacters = atob(base64);
  const byteNumbers = new Array(byteCharacters.length);
  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }
  const byteArray = new Uint8Array(byteNumbers);

  const blob = new Blob([byteArray], { type: 'application/pdf' });
  const blobUrl = URL.createObjectURL(blob);
  
  const newWindow = window.open(blobUrl);
  if (!newWindow || newWindow.closed || typeof newWindow.closed === 'undefined') {
    alert('Popup was blocked. Please allow popups for this website.');
  }
}
const formatInterviewTime=(dateString:string)=>{
  if (!dateString) return "Not scheduled";
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return "Invalid date";

const options: Intl.DateTimeFormatOptions = {
  year: 'numeric',
  month: 'long',    
  day: 'numeric',
  hour: 'numeric',
  minute: 'numeric',
  hour12: true      
};

return date.toLocaleString('en-US', options);
}  

  export {formatDate, timeAgo, getBase64, openPDF, formatInterviewTime};