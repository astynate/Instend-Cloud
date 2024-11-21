class ResponseHandler {
    static DownloadFromResponse = (response) => {
        let blob = new Blob([response.data], {type: 'application/octet-stream'});
        let url = window.URL.createObjectURL(blob);
        let link = document.createElement('a');
        let contentDisposition = response.headers['content-disposition'];
        let filename = 'default_filename';
    
        link.href = url;
      
        if (contentDisposition) {
            const filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
            let matches = filenameRegex.exec(contentDisposition);
            if (matches != null && matches[1]) { 
              filename = matches[1].replace(/['"]/g, '');
            }
        }
    
        link.setAttribute('download', filename);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);  
    };
};

export default ResponseHandler;