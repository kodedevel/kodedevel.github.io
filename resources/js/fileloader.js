function loadJavaScript(url ,integrity,crossOrigin){
    const script = document.createElement('script');
    script.src = url;
    script.integrity = integrity;
    script.crossOrigin = crossOrigin;
    document.head.appendChild(script);
}


function loadStylesheet(url , integrity, crossOrigin){
    const link = document.createElement('link');
    link.href = url;
    link.integrity = integrity;
    link.crossOrigin = crossOrigin;
    link.rel = "stylesheet";
    document.head.appendChild(link);
}

export {loadJavaScript, loadStylesheet};