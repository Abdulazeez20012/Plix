module plix::user_relationships_tests {
    use std::string::String;
    use sui::test_scenario;
    use plix::user_profile::{Self, UserProfile};
    use plix::user_relationships::{Self, UserFollowers, FollowerRelation};

    #[test]
    public fun test_follow_unfollow() {
        let scenario = test_scenario::begin(0x1);
        {
            let scenario_val = &mut scenario;
            
            // Create first user profile
            test_scenario::next_tx(scenario_val, 0x1);
            user_profile::create_profile(
                string::utf8(b"John Doe"),
                string::utf8(b"A Sui developer"),
                string::utf8(b"https://example.com/profile1.jpg"),
                test_scenario::ctx(scenario_val)
            );

            // Get first user profile
            let profile1 = test_scenario::take_shared_object<UserProfile>(scenario_val);
            
            // Create second user profile
            test_scenario::next_tx(scenario_val, 0x2);
            user_profile::create_profile(
                string::utf8(b"Jane Smith"),
                string::utf8(b"Another Sui developer"),
                string::utf8(b"https://example.com/profile2.jpg"),
                test_scenario::ctx(scenario_val)
            );

            // Get second user profile
            let profile2 = test_scenario::take_shared_object<UserProfile>(scenario_val);
            
            // Initialize relationships for both users
            test_scenario::next_tx(scenario_val, 0x1);
            user_relationships::init_user_relationships(&mut profile1, test_scenario::ctx(scenario_val));
            let relations1 = test_scenario::take_shared_object<UserFollowers>(scenario_val);
            
            test_scenario::next_tx(scenario_val, 0x2);
            user_relationships::init_user_relationships(&mut profile2, test_scenario::ctx(scenario_val));
            let relations2 = test_scenario::take_shared_object<UserFollowers>(scenario_val);
            
            // User 1 follows User 2
            test_scenario::next_tx(scenario_val, 0x1);
            user_relationships::follow_user(
                &mut profile1,
                &mut profile2,
                &mut relations1,
                &mut relations2,
                test_scenario::ctx(scenario_val)
            );
            
            // Verify follower counts
            assert!(user_profile::get_followers_count(&profile2) == 1, 0);
            assert!(user_profile::get_following_count(&profile1) == 1, 0);
            
            // User 1 unfollows User 2
            user_relationships::unfollow_user(
                &mut profile1,
                &mut profile2,
                &mut relations1,
                &mut relations2
            );
            
            // Verify follower counts after unfollow
            assert!(user_profile::get_followers_count(&profile2) == 0, 0);
            assert!(user_profile::get_following_count(&profile1) == 0, 0);
            
            // Return objects to scenario
            test_scenario::return_shared_object(scenario_val, profile1);
            test_scenario::return_shared_object(scenario_val, profile2);
            test_scenario::return_shared_object(scenario_val, relations1);
            test_scenario::return_shared_object(scenario_val, relations2);
        };
        test_scenario::end(scenario);
    }
}