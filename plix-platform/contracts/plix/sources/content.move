module plix::content {
    use std::string::String;
    use sui::object::{UID, ID};
    use sui::transfer;
    use sui::tx_context::TxContext;
    use sui::vec_map::{Self, VecMap};

    public struct Post has key {
        id: UID,
        author: address,
        content: String,
        media_urls: vector<String>,
        likes: u64,
        shares: u64,
        timestamp: u64,
        metadata: VecMap<String, String>,
    }

    public struct Comment has key {
        id: UID,
        post_id: ID, // Use ID instead of UID for referencing
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
            metadata: vec_map::empty(),
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
            metadata: vec_map::empty(),
        };
        transfer::transfer(shared_post, tx_context::sender(ctx));
    }

    // Add metadata to a post
    public entry fun add_metadata(post: &mut Post, key: String, value: String) {
        post.metadata.insert(key, value);
    }

    // Create a comment on a post
    public entry fun create_comment(
        post: &Post, // Pass the post object instead of just the ID
        content: String,
        ctx: &mut TxContext
    ) {
        // Get the post ID
        let post_id = object::id(post);
        
        let comment = Comment {
            id: object::new(ctx),
            post_id, // Store the ID reference
            author: tx_context::sender(ctx),
            content,
            timestamp: ctx.epoch(),
        };
        transfer::transfer(comment, tx_context::sender(ctx));
    }

    // Like a comment
    public entry fun like_comment(_comment: &mut Comment) {
        // In a real implementation, you might want to track who liked the comment
        // For now, we'll just increment the likes count (you'd need to add this field)
    }
}