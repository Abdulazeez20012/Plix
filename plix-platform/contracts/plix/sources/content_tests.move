module plix::content_tests {
    use std::string::String;
    use sui::test_scenario;
    use plix::content::{Self, Post, Comment};

    #[test]
    public fun test_create_and_like_post() {
        let scenario = test_scenario::begin(0x1);
        {
            let scenario_val = &mut scenario;
            
            // Create a post
            test_scenario::next_tx(scenario_val, 0x1);
            let mut media_urls = vector::empty<String>();
            vector::push_back(&mut media_urls, string::utf8(b"https://example.com/image1.jpg"));
            vector::push_back(&mut media_urls, string::utf8(b"https://example.com/image2.jpg"));
            
            content::create_post(
                string::utf8(b"This is a test post about Sui blockchain technology"),
                media_urls,
                test_scenario::ctx(scenario_val)
            );

            // Get the post
            let post = test_scenario::take_shared_object<Post>(scenario_val);
            
            // Verify initial post properties
            assert!(post.likes == 0, 0);
            assert!(post.shares == 0, 0);
            
            // Like the post
            content::like_post(&mut post);
            assert!(post.likes == 1, 0);
            
            // Share the post
            content::share_post(&mut post, test_scenario::ctx(scenario_val));
            
            // Verify share count
            assert!(post.shares == 1, 0);
            
            // Add metadata to the post
            content::add_metadata(
                &mut post,
                string::utf8(b"category"),
                string::utf8(b"technology")
            );
            
            // Return the post to the scenario
            test_scenario::return_shared_object(scenario_val, post);
        };
        test_scenario::end(scenario);
    }

    #[test]
    public fun test_create_comment() {
        let scenario = test_scenario::begin(0x1);
        {
            let scenario_val = &mut scenario;
            
            // Create a post first
            test_scenario::next_tx(scenario_val, 0x1);
            let media_urls = vector::empty<String>();
            
            content::create_post(
                string::utf8(b"This is a test post for commenting"),
                media_urls,
                test_scenario::ctx(scenario_val)
            );

            // Get the post
            let post = test_scenario::take_shared_object<Post>(scenario_val);
            
            // Create a comment on the post
            content::create_comment(
                &post,
                string::utf8(b"This is a great post!"),
                test_scenario::ctx(scenario_val)
            );
            
            // Return the post to the scenario
            test_scenario::return_shared_object(scenario_val, post);
        };
        test_scenario::end(scenario);
    }
}