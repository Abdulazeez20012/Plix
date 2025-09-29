module plix::user_profile {
    use std::string::String;
    use sui::object::{Self, UID};
    use sui::transfer;
    use sui::tx_context::TxContext;

    public struct UserProfile has key {
        id: UID,
        name: String,
        bio: String,
        profile_picture_url: String,
        followers_count: u64,
        following_count: u64,
        created_at: u64,
    }

    // Create a new user profile
    public entry fun create_profile(
        name: String,
        bio: String,
        profile_picture_url: String,
        ctx: &mut TxContext
    ) {
        let profile = UserProfile {
            id: object::new(ctx),
            name,
            bio,
            profile_picture_url,
            followers_count: 0,
            following_count: 0,
            created_at: ctx.epoch(),
        };
        transfer::transfer(profile, tx_context::sender(ctx));
    }

    // Update user profile information
    public entry fun update_profile(
        profile: &mut UserProfile,
        name: String,
        bio: String,
        profile_picture_url: String,
    ) {
        profile.name = name;
        profile.bio = bio;
        profile.profile_picture_url = profile_picture_url;
    }

    // Update follower count
    public entry fun update_followers_count(
        profile: &mut UserProfile,
        count: u64,
    ) {
        profile.followers_count = count;
    }

    // Update following count
    public entry fun update_following_count(
        profile: &mut UserProfile,
        count: u64,
    ) {
        profile.following_count = count;
    }

    // Delete a user profile
    public entry fun delete_profile(profile: UserProfile) {
        let UserProfile {
            id,
            name: _,
            bio: _,
            profile_picture_url: _,
            followers_count: _,
            following_count: _,
            created_at: _,
        } = profile;
        object::delete(id);
    }

    // Getters for profile information
    public fun get_name(profile: &UserProfile): &String {
        &profile.name
    }

    public fun get_bio(profile: &UserProfile): &String {
        &profile.bio
    }

    public fun get_profile_picture_url(profile: &UserProfile): &String {
        &profile.profile_picture_url
    }

    public fun get_followers_count(profile: &UserProfile): u64 {
        profile.followers_count
    }

    public fun get_following_count(profile: &UserProfile): u64 {
        profile.following_count
    }

    public fun get_created_at(profile: &UserProfile): u64 {
        profile.created_at
    }
}