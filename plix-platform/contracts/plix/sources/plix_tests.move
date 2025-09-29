module plix::plix_tests {
    use std::string::String;
    use sui::test_scenario;
    use plix::plix::{Self, PlatformConfig};

    #[test]
    public fun test_initialize_platform() {
        let scenario = test_scenario::begin(0x1);
        {
            let scenario_val = &mut scenario;
            
            // Initialize the platform
            test_scenario::next_tx(scenario_val, 0x1);
            plix::initialize_platform(
                string::utf8(b"Plix Social Platform"),
                string::utf8(b"1.0.0"),
                test_scenario::ctx(scenario_val)
            );

            // Get the platform config
            let config = test_scenario::take_shared_object<PlatformConfig>(scenario_val);
            
            // Verify platform properties
            assert!(string::bytes_equal(plix::get_platform_name(&config), b"Plix Social Platform"), 0);
            assert!(string::bytes_equal(plix::get_platform_version(&config), b"1.0.0"), 0);
            
            // Return the config to the scenario
            test_scenario::return_shared_object(scenario_val, config);
        };
        test_scenario::end(scenario);
    }
}