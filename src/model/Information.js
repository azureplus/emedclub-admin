/*
        Information: {
            category: n,
            author: s,
            title: s,
            media: s,
            content: s,
            total_views: n,
            total_comments: n,
            total_likes: n,
            price: n,
            state: n
        },
*/
import Model from './Model'

export default class Information extends Model {
    constructor(attrs){
        super("Information", attrs);

        this.defineRWAttrs(["category", "author", "title", "media", "content", "total_views", "total_comments", "total_likes", "price", "state"]);
    }

    static createDefault() {
        return new Information({
            category: 0, author: '', title: '', media: '', content: ''
        })
    }
}