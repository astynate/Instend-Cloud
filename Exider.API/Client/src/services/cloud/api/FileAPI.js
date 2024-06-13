class FileAPI {
    imageTypes = ['png', 'gif', 'jpeg', 'jpg'];
    videoTypes = ['mov', 'mp4'];
    musicTypes = ['wav', 'mp3', 'm4a'];
    galleryTypes = [...this.imageTypes, ...this.videoTypes];
}

export default new FileAPI();