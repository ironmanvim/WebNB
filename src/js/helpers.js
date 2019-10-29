function exportToJsonFile(jsonData, name) {
    let dataStr = JSON.stringify(jsonData, null, 4);
    let dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);

    let exportFileDefaultName = `${name}.vebpynb`;

    let linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
}
export default {
    exportToJsonFile
}
