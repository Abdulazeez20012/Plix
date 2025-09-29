module plix::plix {
    use std::string::String;
    use sui::object::{Self, UID};
    use sui::transfer;
    use sui::tx_context::TxContext;
    
    // This is the main module that ties together all Plix platform functionality
    
    // Platform configuration object
    public struct PlatformConfig has key {
        id: UID,
        name: String,
        version: String,
        created_at: u64,
    }
    
    // Initialize the platform
    public entry fun initialize_platform(
        name: String,
        version: String,
        ctx: &mut TxContext
    ) {
        let config = PlatformConfig {
            id: object::new(ctx),
            name,
            version,
            created_at: ctx.epoch(),
        };
        transfer::transfer(config, tx_context::sender(ctx));
    }
    
    // Get platform name
    public fun get_platform_name(config: &PlatformConfig): &String {
        &config.name
    }
    
    // Get platform version
    public fun get_platform_version(config: &PlatformConfig): &String {
        &config.version
    }
}