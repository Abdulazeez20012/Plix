module plix::user_profile_tests {
    use std::string::String;
    use sui::test_scenario;
    use plix::user_profile::{Self, UserProfile};

    #[test]
    public fun test_create_and_update_profile() {
        let scenario = test_scenario::begin(0x1);
        {
            let scenario_val = &mut scenario;
            
            // Create a profile
            test_scenario::next_tx(scenario_val, 0x1);
            user_profile::create_profile(
                string::utf8(b"John Doe"),
                string::utf8(b"A Sui developer"),
                string::utf8(b"https://example.com/profile.jpg"),
                test_scenario::ctx(scenario_val)
            );

            // Get the profile
            let profile = test_scenario::take_shared_object<UserProfile>(scenario_val);
            
            // Verify initial values
            assert!(string::bytes_equal(user_profile::get_name(&profile), b"John Doe"), 0);
            assert!(string::bytes_equal(user_profile::get_bio(&profile), b"A Sui developer"), 0);
            assert!(string::bytes_equal(user_profile::get_profile_picture_url(&profile), b"https://example.com/profile.jpg"), 0);
            assert!(user_profile::get_followers_count(&profile) == 0, 0);
            assert!(user_profile::get_following_count(&profile) == 0, 0);

            // Update the profile
            user_profile::update_profile(
                &mut profile,
                string::utf8(b"Jane Doe"),
                string::utf8(b"A Move programmer"),
                string::utf8(b"https://example.com/new-profile.jpg")
            );

            // Verify updated values
            assert!(string::bytes_equal(user_profile::get_name(&profile), b"Jane Doe"), 0);
            assert!(string::bytes_equal(user_profile::get_bio(&profile), b"A Move programmer"), 0);
            assert!(string::bytes_equal(user_profile::get_profile_picture_url(&profile), b"https://example.com/new-profile.jpg"), 0);

            // Update follower count
            user_profile::update_followers_count(&mut profile, 10);
            assert!(user_profile::get_followers_count(&profile) == 10, 0);

            // Update following count
            user_profile::update_following_count(&mut profile, 5);
            assert!(user_profile::get_following_count(&profile) == 5, 0);

            // Return the profile to the scenario
            test_scenario::return_shared_object(scenario_val, profile);
        };
        test_scenario::end(scenario);
    }

    #[test]
    public fun test_delete_profile() {
        let scenario = test_scenario::begin(0x1);
        {
            let scenario_val = &mut scenario;
            
            // Create a profile
            test_scenario::next_tx(scenario_val, 0x1);
            user_profile::create_profile(
                string::utf8(b"John Doe"),
                string::utf8(b"A Sui developer"),
                string::utf8(b"https://example.com/profile.jpg"),
                test_scenario::ctx(scenario_val)
            );

            // Get the profile and delete it
            let profile = test_scenario::take_shared_object<UserProfile>(scenario_val);
            user_profile::delete_profile(profile);
        };
        test_scenario::end(scenario);
    }
}