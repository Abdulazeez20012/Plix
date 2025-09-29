module plix::content {
    use std::string::String;
    use sui::object::{Self, UID};
    use sui::transfer;
    use sui::tx_context::{Self, TxContext};
    use sui::vec_map::VecMap;
    use plix::user_profile::UserProfile;

    struct Post has key {
        id: UID,
        author: address,
        content: String,
        media_urls: vector<String>,
        likes: u64,
        shares: u64,
        timestamp: u64,
        metadata: VecMap<String, String>,
    }

    struct Comment has key {
        id: UID,
        post_id: UID,
        author: address,
        content: String,
        timestamp: u64,
    }

    // Create a new post
    public entry fun create_post(
        content: String,
        media_urls: vector<String>,
        ctx: &mut TxContext
    ) {
        let post = Post {
            id: object::new(ctx),
            author: tx_context::sender(ctx),
            content,
            media_urls,
            likes: 0,
            shares: 0,
            timestamp: ctx.epoch(),
            metadata: VecMap::empty(),
        };
        transfer::transfer(post, tx_context::sender(ctx));
    }

    // Like a post
    public entry fun like_post(post: &mut Post) {
        post.likes = post.likes + 1;
    }

    // Share a post
    public entry fun share_post(post: &mut Post, ctx: &mut TxContext) {
        post.shares = post.shares + 1;
        
        // Create a new shared post
        let shared_post = Post {
            id: object::new(ctx),
            author: tx_context::sender(ctx),
            content: *&post.content,
            media_urls: *&post.media_urls,
            likes: 0,
            shares: 0,
            timestamp: ctx.epoch(),
            metadata: VecMap::empty(),
        };
        transfer::transfer(shared_post, tx_context::sender(ctx));
    }

    // Add metadata to a post
    public entry fun add_metadata(post: &mut Post, key: String, value: String) {
        post.metadata.insert(key, value);
    }

    // Create a comment on a post
    public entry fun create_comment(
        post_id: UID,
        content: String,
        ctx: &mut TxContext
    ) {
        let comment = Comment {
            id: object::new(ctx),
            post_id,
            author: tx_context::sender(ctx),
            content,
            timestamp: ctx.epoch(),
        };
        transfer::transfer(comment, tx_context::sender(ctx));
    }

    // Getters
    public fun get_content(post: &Post): &String {
        &post.content
    }

    public fun get_author(post: &Post): address {
        post.author
    }

    public fun get_likes(post: &Post): u64 {
        post.likes
    }

    public fun get_shares(post: &Post): u64 {
        post.shares
    }
}