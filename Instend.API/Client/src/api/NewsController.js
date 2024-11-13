class NewsController {
    static GetNews = async (lastPublicationDate) => {
        let news = [];

        await instance.get(`api/news?lastPublicationDate=${lastPublicationDate}`)
            .then((response) => {
                const ids = this.news.map(element => element.id);
                const newPosts = response.data.filter(post => !ids.includes(post.comment.id));

                if (newPosts.length && newPosts.length > 0) {
                    this.news = [...this.news, ...newPosts].sort(this.sortByDate);
                }

                this.isHasMore = newPosts.length && newPosts.length >= 7;
            });

        return news;
    }
}