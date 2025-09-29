module plix::user_relationships {
    use std::string::String;
    use sui::object::{Self, UID};
    use sui::transfer;
    use sui::tx_context::TxContext;
    use sui::bag::{Bag, Self};
    use sui::vec_set::{VecSet, Self};
    use plix::user_profile::{Self, UserProfile};

    public struct FollowerRelation has key {
        id: UID,
        follower_id: address,
        following_id: address,
        created_at: u64,
    }

    public struct UserFollowers has key {
        id: UID,
        user_id: address,
        followers: VecSet<address>,
        following: VecSet<address>,
    }

    // Initialize user relationships
    public entry fun init_user_relationships(
        user_profile: &mut UserProfile,
        ctx: &mut TxContext
    ) {
        let user_id = tx_context::sender(ctx);
        let followers = vec_set::empty<address>();
        let following = vec_set::empty<address>();
        
        let user_followers = UserFollowers {
            id: object::new(ctx),
            user_id,
            followers,
            following,
        };
        
        // Update profile counts to 0
        user_profile::update_followers_count(user_profile, 0);
        user_profile::update_following_count(user_profile, 0);
        
        transfer::transfer(user_followers, user_id);
    }

    // Follow a user
    public entry fun follow_user(
        follower_profile: &mut UserProfile,
        following_profile: &mut UserProfile,
        follower_relations: &mut UserFollowers,
        following_relations: &mut UserFollowers,
        ctx: &mut TxContext
    ) {
        let follower_id = tx_context::sender(ctx);
        let following_id = object::id(following_profile);
        
        // Create the relationship
        let relation = FollowerRelation {
            id: object::new(ctx),
            follower_id,
            following_id,
            created_at: ctx.epoch(),
        };
        
        // Add to follower's following list
        vec_set::insert(&mut follower_relations.following, following_id);
        
        // Add to following's followers list
        vec_set::insert(&mut following_relations.followers, follower_id);
        
        // Update counts
        user_profile::update_following_count(follower_profile, vec_set::size(&follower_relations.following));
        user_profile::update_followers_count(following_profile, vec_set::size(&following_relations.followers));
        
        // Transfer the relation object to the module owner
        transfer::transfer(relation, tx_context::sender(ctx));
    }

    // Unfollow a user
    public entry fun unfollow_user(
        follower_profile: &mut UserProfile,
        following_profile: &mut UserProfile,
        follower_relations: &mut UserFollowers,
        following_relations: &mut UserFollowers,
    ) {
        let follower_id = tx_context::sender(ctx);
        let following_id = object::id(following_profile);
        
        // Remove from follower's following list
        vec_set::remove(&mut follower_relations.following, following_id);
        
        // Remove from following's followers list
        vec_set::remove(&mut following_relations.followers, follower_id);
        
        // Update counts
        user_profile::update_following_count(follower_profile, vec_set::size(&follower_relations.following));
        user_profile::update_followers_count(following_profile, vec_set::size(&following_relations.followers));
    }

    // Getters
    public fun get_followers(user_followers: &UserFollowers): &VecSet<address> {
        &user_followers.followers
    }

    public fun get_following(user_followers: &UserFollowers): &VecSet<address> {
        &user_followers.following
    }

    public fun get_follower_count(user_followers: &UserFollowers): u64 {
        vec_set::size(&user_followers.followers)
    }

    public fun get_following_count(user_followers: &UserFollowers): u64 {
        vec_set::size(&user_followers.following)
    }
}