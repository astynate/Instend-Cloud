class FileAPI {
    imageTypes = ['png', 'gif', 'jpeg', 'jpg'];
    videoTypes = ['mov', 'mp4'];
    musicTypes = ['wav', 'mp3', 'm4a'];
    galleryTypes = [...this.imageTypes, ...this.videoTypes];
    domain = 'http://192.168.1.63:5000';
}

export default new FileAPI();